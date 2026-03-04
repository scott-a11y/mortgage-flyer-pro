import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Server-side AI proxy for Google Gemini.
 * Keeps GEMINI_API_KEY out of the client bundle.
 *
 * POST /api/ai/generate
 * Body: { prompt: string, model?: string }
 * Returns: { text: string }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      text: '',
      fallback: true,
      hint: 'Set GEMINI_API_KEY (server-side, no VITE_ prefix) in Vercel environment variables.'
    });
  }

  const { prompt, model = 'gemini-1.5-flash' } = req.body || {};

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
