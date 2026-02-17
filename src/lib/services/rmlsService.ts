import type { PropertyListing } from '@/types/property';

export interface RMLSSearchResult {
  mlsNumber: string;
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
  heroImage: string;
  galleryImages: string[];
}

export interface RMLSSearchResponse {
  results: RMLSSearchResult[];
  error?: string;
  hint?: string;
  demo?: boolean;
}

/**
 * Search RMLS by MLS number
 */
export async function searchByMLS(mlsNumber: string): Promise<RMLSSearchResponse> {
  const res = await fetch(`/api/rmls/search?mls=${encodeURIComponent(mlsNumber)}`);
  return res.json();
}

/**
 * Search RMLS by address
 */
export async function searchByAddress(address: string, city?: string): Promise<RMLSSearchResponse> {
  let url = `/api/rmls/search?address=${encodeURIComponent(address)}`;
  if (city) url += `&city=${encodeURIComponent(city)}`;
  const res = await fetch(url);
  return res.json();
}

/**
 * Convert an RMLS search result into a PropertyListing object
 * that the app can use directly.
 */
export function rmlsResultToPropertyListing(result: RMLSSearchResult): PropertyListing {
  return {
    specs: {
      address: result.address,
      city: result.city,
      state: result.state,
      zip: result.zip,
      listPrice: result.listPrice,
      mlsNumber: result.mlsNumber,
      bedrooms: result.bedrooms,
      bathrooms: result.bathrooms,
      squareFootage: result.squareFootage,
      lotSize: result.lotSize,
      yearBuilt: result.yearBuilt,
      garage: result.garage,
      hoa: result.hoa,
      propertyType: result.propertyType
    },
    features: {
      headline: `${result.bedrooms}BR/${result.bathrooms}BA ${result.propertyType} in ${result.city}`,
      subheadline: result.status === 'Active' ? 'Active Listing' : result.status,
      bulletPoints: result.description
        ? result.description.split('. ').slice(0, 5).map(s => s.trim()).filter(Boolean)
        : []
    },
    images: {
      hero: result.heroImage || '/placeholder.svg',
      secondary: result.galleryImages || []
    },
    financing: {
      listPrice: result.listPrice,
      downPaymentPercent: 20,
      interestRate: 6.5,
      loanTermYears: 30,
      propertyTax: result.annualTax || undefined,
      hoa: result.hoa || undefined
    }
  };
}
