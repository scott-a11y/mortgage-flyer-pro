import type { VercelRequest, VercelResponse } from '@vercel/node';

// ---------------------------------------------------------------------------
// Security: Allowed models whitelist (C2 fix)
// ---------------------------------------------------------------------------
const ALLOWED_MODELS = new Set([
  'gemini-1.5-flash',
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash',
]);

// ---------------------------------------------------------------------------
// Security: Simple in-memory rate limiter (C3 fix)
// Tracks per-IP request counts in a sliding window.
// On Vercel serverless each cold start resets, but this still throttles
// hot-function bursts within a single instance.
// ---------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 20;           // max requests per IP per window

const ipHits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || now > entry.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// ---------------------------------------------------------------------------
// Security: Origin validation
// ---------------------------------------------------------------------------
const ALLOWED_ORIGINS = new Set([
  'https://mortgage-flyer-pro.vercel.app',
  'https://www.mortgage-flyer-pro.vercel.app',
  'http://localhost:8080',
  'http://localhost:5173',
]);

function isValidOrigin(origin: string | undefined): boolean {
  if (!origin) return false;
  // Also allow any *.vercel.app preview deploys
  if (origin.endsWith('.vercel.app')) return true;
  return ALLOWED_ORIGINS.has(origin);
}

/**
 * Server-side AI proxy for Google Gemini.
 * Keeps GEMINI_API_KEY out of the client bundle.
 *
 * POST /api/ai/generate
 * Body: { prompt: string, model?: string }
 * Returns: { text: string }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // --- CORS preflight ---
  const origin = req.headers.origin as string | undefined;
  if (req.method === 'OPTIONS') {
    if (isValidOrigin(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin!);
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.setHeader('Access-Control-Max-Age', '86400');
    }
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // --- Origin check ---
  if (process.env.NODE_ENV === 'production' && !isValidOrigin(origin)) {
    return res.status(403).json({ error: 'Forbidden: invalid origin' });
  }

  // --- Rate limit ---
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Try again in a minute.' });
  }

  // --- Set CORS header for valid origins ---
  if (isValidOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin!);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      text: '',
      fallback: true,
      hint: 'Set GEMINI_API_KEY (server-side, no VITE_ prefix) in Vercel environment variables.'
    });
  }

  // --- Validate & sanitize model (C2 fix) ---
  const requestedModel = req.body?.model;
  const model = (typeof requestedModel === 'string' && ALLOWED_MODELS.has(requestedModel))
    ? requestedModel
    : 'gemini-1.5-flash';

  const { prompt } = req.body || {};

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Request body must include a "prompt" string.' });
  }

  // Limit prompt length to prevent abuse
  if (prompt.length > 10000) {
    return res.status(400).json({ error: 'Prompt exceeds maximum length (10,000 characters).' });
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.8,
        }
      })
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return res.status(geminiRes.status).json({
        error: 'Gemini API error',
        status: geminiRes.status,
        detail: errText
      });
    }

    const data = await geminiRes.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return res.status(200).json({ text });
  } catch (err: unknown) {
    return res.status(500).json({
      error: 'Server error',
      detail: err instanceof Error ? err.message : String(err)
    });
  }
}
