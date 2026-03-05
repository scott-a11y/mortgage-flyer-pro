import type { VercelRequest, VercelResponse } from '@vercel/node';

// RMLS RESO Web API proxy — keeps bearer token server-side
const RMLS_API_BASE = 'https://resoapi.rmlsweb.com/reso/odata';

interface RmlsProperty {
  ListingId?: string;
  ListingKey?: string;
  StreetNumber?: string;
  StreetName?: string;
  StreetSuffix?: string;
  UnitNumber?: string;
  City?: string;
  StateOrProvince?: string;
  PostalCode?: string;
  ListPrice?: number;
  BedroomsTotal?: number;
  BathroomsTotalInteger?: number;
  LivingArea?: number;
  LotSizeArea?: number;
  YearBuilt?: number;
  GarageSpaces?: number;
  PropertyType?: string;
  StandardStatus?: string;
  PublicRemarks?: string;
  AssociationFee?: number;
  TaxAnnualAmount?: number;
}

interface RmlsListing {
  mlsNumber: string | undefined;
  address: string;
  city: string;
  state: string;
  zip: string;
  listPrice: number;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  lotSize: string;
  yearBuilt: number;
  garage: string;
  propertyType: string;
  status: string;
  description: string;
  hoa: number;
  annualTax: number;
}

interface RmlsMedia {
  MediaURL?: string;
}

/**
 * Sanitize a user-supplied string for safe interpolation into an OData filter.
 * Strips everything except alphanumeric, spaces, hyphens, and periods,
 * then escapes single quotes by doubling them (OData convention).
 */
function sanitizeOData(value: string): string {
  return value
    .replace(/[^a-zA-Z0-9\s\-\.]/g, '')
    .replace(/'/g, "''")
    .trim()
    .slice(0, 200);
}

// ---------------------------------------------------------------------------
// Security: In-memory rate limiter (C3 fix)
// ---------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;
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

const ALLOWED_ORIGINS = new Set([
  'https://mortgage-flyer-pro.vercel.app',
  'http://localhost:8080',
  'http://localhost:5173',
]);

function isValidOrigin(origin: string | undefined): boolean {
  if (!origin) return false;
  if (origin.endsWith('.vercel.app')) return true;
  return ALLOWED_ORIGINS.has(origin);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Origin validation in production
  const origin = req.headers.origin as string | undefined;
  if (process.env.NODE_ENV === 'production' && !isValidOrigin(origin)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  if (isValidOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin!);
  }

  // Rate limit
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Try again in a minute.' });
  }

  const token = process.env.RMLS_BEARER_TOKEN;
  if (!token) {
    return res.status(200).json({
      error: 'RMLS not configured',
      hint: 'Set RMLS_BEARER_TOKEN in Vercel environment variables after completing the RMLS data license (LCLA).',
      demo: true,
      results: []
    });
  }

  const rawMls = Array.isArray(req.query.mls) ? req.query.mls[0] : req.query.mls;
  const rawAddress = Array.isArray(req.query.address) ? req.query.address[0] : req.query.address;
  const rawCity = Array.isArray(req.query.city) ? req.query.city[0] : req.query.city;

  try {
    let filter = '';

    if (rawMls) {
      const mls = sanitizeOData(String(rawMls));
      filter = `$filter=ListingId eq '${mls}'`;
    } else if (rawAddress) {
      const address = sanitizeOData(String(rawAddress));
      filter = `$filter=contains(StreetName,'${address}')`;
      if (rawCity) {
        const city = sanitizeOData(String(rawCity));
        filter += ` and City eq '${city}'`;
      }
    } else {
      return res.status(400).json({ error: 'Provide mls or address query parameter' });
    }

    // Select only the fields we need for the listing card
    const select = [
      'ListingId', 'ListingKey', 'StreetNumber', 'StreetName', 'StreetSuffix',
      'UnitNumber', 'City', 'StateOrProvince', 'PostalCode',
      'ListPrice', 'BedroomsTotal', 'BathroomsTotalInteger',
      'LivingArea', 'LotSizeArea', 'YearBuilt', 'GarageSpaces',
      'PropertyType', 'StandardStatus', 'PublicRemarks',
      'AssociationFee', 'TaxAnnualAmount'
    ].join(',');

    const url = `${RMLS_API_BASE}/Property?${filter}&$select=${select}&$top=10`;

    const rmlsRes = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!rmlsRes.ok) {
      const text = await rmlsRes.text();
      return res.status(rmlsRes.status).json({
        error: 'RMLS API error',
        status: rmlsRes.status,
        detail: text
      });
    }

    const data = await rmlsRes.json();
    const listings = (data.value || []).map((p: RmlsProperty) => ({
      mlsNumber: p.ListingId || p.ListingKey,
      address: [p.StreetNumber, p.StreetName, p.StreetSuffix, p.UnitNumber]
        .filter(Boolean).join(' '),
      city: p.City || '',
      state: p.StateOrProvince || 'OR',
      zip: p.PostalCode || '',
      listPrice: p.ListPrice || 0,
      bedrooms: p.BedroomsTotal || 0,
      bathrooms: p.BathroomsTotalInteger || 0,
      squareFootage: p.LivingArea || 0,
      lotSize: p.LotSizeArea ? `${p.LotSizeArea} sqft` : 'N/A',
      yearBuilt: p.YearBuilt || 0,
      garage: p.GarageSpaces ? `${p.GarageSpaces} car` : 'N/A',
      propertyType: p.PropertyType || 'Residential',
      status: p.StandardStatus || 'Active',
      description: p.PublicRemarks || '',
      hoa: p.AssociationFee || 0,
      annualTax: p.TaxAnnualAmount || 0
    }));

    // Fetch photos for each listing
    const withPhotos = await Promise.all(
      listings.map(async (listing: RmlsListing) => {
        try {
          const safeKey = sanitizeOData(String(listing.mlsNumber || ''));
          const mediaUrl = `${RMLS_API_BASE}/Media?$filter=ResourceRecordKey eq '${safeKey}' and MediaCategory eq 'Photo'&$select=MediaURL,Order&$orderby=Order&$top=6`;
          const mediaRes = await fetch(mediaUrl, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          });
          if (mediaRes.ok) {
            const mediaData = await mediaRes.json();
            const photos = (mediaData.value || []).map((m: RmlsMedia) => m.MediaURL);
            return {
              ...listing,
              heroImage: photos[0] || '',
              galleryImages: photos.slice(1)
            };
          }
        } catch {
          // Media fetch failed — return listing without photos
        }
        return { ...listing, heroImage: '', galleryImages: [] };
      })
    );

    return res.status(200).json({ results: withPhotos });
  } catch (err: unknown) {
    return res.status(500).json({ error: 'Server error', detail: err instanceof Error ? err.message : String(err) });
  }
}
