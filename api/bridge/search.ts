import type { VercelRequest, VercelResponse } from '@vercel/node';

// Bridge Interactive RESO Web API proxy for NWMLS (Washington) data
// Uses OData format: https://api.bridgedataoutput.com/api/v2/OData/{dataset_id}/Property
const BRIDGE_API_BASE = 'https://api.bridgedataoutput.com/api/v2/OData';

interface BridgeMedia {
  Order?: number;
  MediaURL?: string;
}

interface BridgeProperty {
  ListingId?: string;
  ListingKey?: string;
  StreetNumber?: string;
  StreetName?: string;
  StreetSuffix?: string;
  UnitNumber?: string;
  UnparsedAddress?: string;
  City?: string;
  StateOrProvince?: string;
  PostalCode?: string;
  ListPrice?: number;
  BedroomsTotal?: number;
  BathroomsTotalDecimal?: number;
  LivingArea?: number;
  LotSizeArea?: number;
  YearBuilt?: number;
  GarageSpaces?: number;
  PropertyType?: string;
  StandardStatus?: string;
  PublicRemarks?: string;
  AssociationFee?: number;
  TaxAnnualAmount?: number;
  Media?: BridgeMedia[];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.BRIDGE_BEARER_TOKEN;
  const datasetId = process.env.BRIDGE_DATASET_ID || 'test';

  if (!token) {
    return res.status(200).json({
      error: 'Bridge API not configured',
      hint: 'Set BRIDGE_BEARER_TOKEN and BRIDGE_DATASET_ID in Vercel environment variables after registering at bridgedataoutput.com and getting NWMLS approval.',
      demo: true,
      results: []
    });
  }

  const { mls, address, city } = req.query;

  try {
    let filter = '';
    if (mls) {
      filter = `$filter=ListingId eq '${mls}'`;
    } else if (address) {
      filter = `$filter=contains(tolower(UnparsedAddress),tolower('${address}'))`;
      if (city) {
        filter += ` and tolower(City) eq tolower('${city}')`;
      }
    } else {
      return res.status(400).json({ error: 'Provide mls or address query parameter' });
    }

    const select = [
      'ListingId', 'ListingKey', 'UnparsedAddress',
      'StreetNumber', 'StreetName', 'StreetSuffix', 'UnitNumber',
      'City', 'StateOrProvince', 'PostalCode',
      'ListPrice', 'BedroomsTotal', 'BathroomsTotalDecimal',
      'LivingArea', 'LotSizeArea', 'YearBuilt', 'GarageSpaces',
      'PropertyType', 'StandardStatus', 'PublicRemarks',
      'AssociationFee', 'TaxAnnualAmount', 'Media'
    ].join(',');

    const url = `${BRIDGE_API_BASE}/${datasetId}/Property?${filter}&$select=${select}&$top=10`;

    const bridgeRes = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!bridgeRes.ok) {
      const text = await bridgeRes.text();
      return res.status(bridgeRes.status).json({
        error: 'Bridge API error',
        status: bridgeRes.status,
        detail: text
      });
    }

    const data = await bridgeRes.json();
    const listings = (data.value || []).map((p: BridgeProperty) => {
      const addr = p.UnparsedAddress || [p.StreetNumber, p.StreetName, p.StreetSuffix, p.UnitNumber].filter(Boolean).join(' ');
      const photos = (p.Media || []).sort((a: BridgeMedia, b: BridgeMedia) => (a.Order || 0) - (b.Order || 0)).map((m: BridgeMedia) => m.MediaURL).filter(Boolean);

      return {
        mlsNumber: p.ListingId || p.ListingKey,
        address: addr,
        city: p.City || '',
        state: p.StateOrProvince || 'WA',
        zip: p.PostalCode || '',
        listPrice: p.ListPrice || 0,
        bedrooms: p.BedroomsTotal || 0,
        bathrooms: p.BathroomsTotalDecimal || 0,
        squareFootage: p.LivingArea || 0,
        lotSize: p.LotSizeArea ? `${p.LotSizeArea} sqft` : 'N/A',
        yearBuilt: p.YearBuilt || 0,
        garage: p.GarageSpaces ? `${p.GarageSpaces} car` : 'N/A',
        propertyType: p.PropertyType || 'Residential',
        status: p.StandardStatus || 'Active',
        description: p.PublicRemarks || '',
        hoa: p.AssociationFee || 0,
        annualTax: p.TaxAnnualAmount || 0,
        heroImage: photos[0] || '',
        galleryImages: photos.slice(1)
      };
    });

    return res.status(200).json({ results: listings });
  } catch (err: unknown) {
    return res.status(500).json({ error: 'Server error', detail: err instanceof Error ? err.message : String(err) });
  }
}
