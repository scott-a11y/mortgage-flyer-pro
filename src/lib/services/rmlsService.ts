import type { PropertyListing } from '@/types/property';

export type MLSSource = 'rmls' | 'nwmls';

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
 * Get the API base path for the selected MLS source
 */
function getApiBase(source: MLSSource): string {
  return source === 'nwmls' ? '/api/bridge/search' : '/api/rmls/search';
}

/**
 * Search by MLS number
 */
export async function searchByMLS(mlsNumber: string, source: MLSSource = 'rmls'): Promise<RMLSSearchResponse> {
  const base = getApiBase(source);
  const res = await fetch(`${base}?mls=${encodeURIComponent(mlsNumber)}`);
  return res.json();
}

/**
 * Search by address
 */
export async function searchByAddress(address: string, city?: string, source: MLSSource = 'rmls'): Promise<RMLSSearchResponse> {
  const base = getApiBase(source);
  let url = `${base}?address=${encodeURIComponent(address)}`;
  if (city) url += `&city=${encodeURIComponent(city)}`;
  const res = await fetch(url);
  return res.json();
}

/**
 * Convert a search result into a PropertyListing object
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

/**
 * MLS source display names
 */
export const MLS_SOURCES: { value: MLSSource; label: string; region: string }[] = [
  { value: 'rmls', label: 'RMLS', region: 'Oregon / SW Washington' },
  { value: 'nwmls', label: 'NWMLS (Bridge)', region: 'Washington' }
];
