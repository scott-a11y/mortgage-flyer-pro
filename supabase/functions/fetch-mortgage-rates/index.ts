import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Generate current date formatted string
function getFormattedDate() {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Simulated market rates (used when no API key is configured)
function generateSimulatedRates() {
  const baseRates = {
    thirtyYearFixed: 6.75,
    fifteenYearFixed: 6.10,
    thirtyYearJumbo: 7.05,
    fiveOneArm: 6.45,
  };

  // Add small random variation (-0.125 to +0.125) to simulate market movement
  const variation = () => (Math.random() - 0.5) * 0.25;

  return {
    thirtyYearFixed: `${(baseRates.thirtyYearFixed + variation()).toFixed(2)}%`,
    thirtyYearFixedAPR: `${(baseRates.thirtyYearFixed + variation() + 0.05).toFixed(2)}%`,
    fifteenYearFixed: `${(baseRates.fifteenYearFixed + variation()).toFixed(2)}%`,
    fifteenYearFixedAPR: `${(baseRates.fifteenYearFixed + variation() + 0.04).toFixed(2)}%`,
    thirtyYearJumbo: `${(baseRates.thirtyYearJumbo + variation()).toFixed(2)}%`,
    thirtyYearJumboAPR: `${(baseRates.thirtyYearJumbo + variation() + 0.06).toFixed(2)}%`,
    fiveOneArm: `${(baseRates.fiveOneArm + variation()).toFixed(2)}%`,
    fiveOneArmAPR: `${(baseRates.fiveOneArm + variation() + 0.03).toFixed(2)}%`,
    dateGenerated: getFormattedDate(),
  };
}

// Fetch real rates from FRED API (Freddie Mac Primary Mortgage Market Survey)
async function fetchFredRates(apiKey: string) {
  const seriesIds = {
    thirtyYearFixed: 'MORTGAGE30US',
    fifteenYearFixed: 'MORTGAGE15US',
    fiveOneArm: 'MORTGAGE5US',
  };

  const rates: Record<string, string> = {};

  for (const [key, seriesId] of Object.entries(seriesIds)) {
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=1`;

    const response = await fetch(url);
    if (!response.ok) {
      console.error(`FRED API error for ${key}:`, response.statusText);
      continue;
    }

    const data = await response.json();
    if (data.observations && data.observations.length > 0) {
      const rate = parseFloat(data.observations[0].value);
      rates[key] = `${rate.toFixed(2)}%`;
      rates[`${key}APR`] = `${(rate + 0.04).toFixed(2)}%`;
    }
  }

  // FRED doesn't have jumbo rates, so we estimate them based on 30-year fixed
  const thirtyYearBase = parseFloat(rates.thirtyYearFixed) || 6.75;
  rates.thirtyYearJumbo = `${(thirtyYearBase + 0.30).toFixed(2)}%`;
  rates.thirtyYearJumboAPR = `${(thirtyYearBase + 0.36).toFixed(2)}%`;

  // If we couldn't fetch 5/1 ARM, use a fallback estimation
  if (!rates.fiveOneArm) {
    rates.fiveOneArm = `${(thirtyYearBase - 0.30).toFixed(2)}%`;
    rates.fiveOneArmAPR = `${(thirtyYearBase - 0.27).toFixed(2)}%`;
  }

  rates.dateGenerated = getFormattedDate();

  return rates;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const fredApiKey = Deno.env.get('FRED_API_KEY');

    // Check if FRED API key is configured
    if (!fredApiKey) {
      console.log('FRED_API_KEY not configured, using simulated rates');
      const rates = generateSimulatedRates();

      return new Response(JSON.stringify({
        success: true,
        rates,
        source: 'Simulated Market Data',
        isSimulated: true,
        message: 'Using simulated rates. To get real Freddie Mac rates, configure your FRED API key.',
        lastUpdated: new Date().toISOString(),
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch real rates from FRED API
    console.log('Fetching live rates from FRED API...');
    const rates = await fetchFredRates(fredApiKey);
    console.log('Fetched FRED rates:', rates);

    return new Response(JSON.stringify({
      success: true,
      rates,
      source: 'Freddie Mac PMMS via FRED',
      isSimulated: false,
      lastUpdated: new Date().toISOString(),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching mortgage rates:', errorMessage);

    // Fallback to simulated rates on error
    const rates = generateSimulatedRates();
    return new Response(JSON.stringify({
      success: true,
      rates,
      source: 'Simulated Market Data (Fallback)',
      isSimulated: true,
      error: errorMessage,
      lastUpdated: new Date().toISOString(),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
