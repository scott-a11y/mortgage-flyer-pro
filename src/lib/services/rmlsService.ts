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
  try {
    const res = await fetch(`${base}?mls=${encodeURIComponent(mlsNumber)}`);
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    }
    return getMockRmlsResponse(mlsNumber);
  } catch (err) {
    return { results: [], error: err instanceof Error ? err.message : "Search failed" };
  }
}

/**
 * Search by address
 */
export async function searchByAddress(address: string, city?: string, source: MLSSource = 'rmls'): Promise<RMLSSearchResponse> {
  const base = getApiBase(source);
  let url = `${base}?address=${encodeURIComponent(address)}`;
  if (city) url += `&city=${encodeURIComponent(city)}`;
  try {
    const res = await fetch(url);
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    }
    return getMockRmlsResponse(address);
  } catch (err) {
    return { results: [], error: err instanceof Error ? err.message : "Search failed" };
  }
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

/**
 * Generate mock data for local development when API routes are unavailable
 */
function getMockRmlsResponse(query: string): RMLSSearchResponse {
  return {
    demo: true,
    hint: "Local mock data. Deploy to Vercel or configure Vite proxy for real API.",
    results: [
      {
        mlsNumber: `MOCK-${Math.floor(Math.random() * 1000000)}`,
        address: query.includes("Ave") ? query : "123 Mockingbird Lane",
        city: "Portland",
        state: "OR",
        zip: "97204",
        listPrice: 850000,
        bedrooms: 4,
        bathrooms: 3,
        squareFootage: 2800,
        lotSize: "0.25 acres",
        yearBuilt: 2015,
        garage: "2 car",
        propertyType: "Single Family",
        status: "Active",
        description: "This is a beautifully appointed mock property generated for local development. It features stunning mock-hardwood floors and a pretend chef's kitchen.",
        hoa: 50,
        annualTax: 8500,
        heroImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
        galleryImages: [
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        ]
      }
    ]
  };
}
