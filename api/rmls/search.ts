import type { VercelRequest, VercelResponse } from '@vercel/node';

// RMLS RESO Web API proxy — keeps bearer token server-side
const RMLS_API_BASE = 'https://resoapi.rmlsweb.com/reso/odata';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
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

  const { mls, address, city } = req.query;

  try {
    let filter = '';

    if (mls) {
      // Search by MLS number (ListingId in RESO)
      filter = `$filter=ListingId eq '${mls}'`;
    } else if (address) {
      // Search by street address (partial match)
      filter = `$filter=contains(StreetName,'${address}')`;
      if (city) {
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
    const listings = (data.value || []).map((p: any) => ({
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
      listings.map(async (listing: any) => {
        try {
          const mediaUrl = `${RMLS_API_BASE}/Media?$filter=ResourceRecordKey eq '${listing.mlsNumber}' and MediaCategory eq 'Photo'&$select=MediaURL,Order&$orderby=Order&$top=6`;
          const mediaRes = await fetch(mediaUrl, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          });
          if (mediaRes.ok) {
            const mediaData = await mediaRes.json();
            const photos = (mediaData.value || []).map((m: any) => m.MediaURL);
            return {
              ...listing,
              heroImage: photos[0] || '',
              galleryImages: photos.slice(1)
            };
          }
        } catch {}
        return { ...listing, heroImage: '', galleryImages: [] };
      })
    );

    return res.status(200).json({ results: withPhotos });
  } catch (err: any) {
    return res.status(500).json({ error: 'Server error', detail: err.message });
  }
}
