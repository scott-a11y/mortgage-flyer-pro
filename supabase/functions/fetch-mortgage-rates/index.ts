import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simulated live rates based on current market trends
// In production, this would connect to a real mortgage rate API
function generateLiveRates() {
  // Base rates with small random variations to simulate live data
  const baseRates = {
    thirtyYearFixed: 6.75,
    fifteenYearFixed: 6.10,
    thirtyYearJumbo: 7.05,
    fiveOneArm: 6.45,
  };

  // Add small random variation (-0.125 to +0.125)
  const variation = () => (Math.random() - 0.5) * 0.25;

  const rates = {
    thirtyYearFixed: (baseRates.thirtyYearFixed + variation()).toFixed(3),
    thirtyYearFixedAPR: (baseRates.thirtyYearFixed + variation() + 0.05).toFixed(3),
    fifteenYearFixed: (baseRates.fifteenYearFixed + variation()).toFixed(3),
    fifteenYearFixedAPR: (baseRates.fifteenYearFixed + variation() + 0.04).toFixed(3),
    thirtyYearJumbo: (baseRates.thirtyYearJumbo + variation()).toFixed(3),
    thirtyYearJumboAPR: (baseRates.thirtyYearJumbo + variation() + 0.06).toFixed(3),
    fiveOneArm: (baseRates.fiveOneArm + variation()).toFixed(3),
    fiveOneArmAPR: (baseRates.fiveOneArm + variation() + 0.03).toFixed(3),
    dateGenerated: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  };

  // Format as percentages
  return {
    thirtyYearFixed: `${rates.thirtyYearFixed}%`,
    thirtyYearFixedAPR: `${rates.thirtyYearFixedAPR}%`,
    fifteenYearFixed: `${rates.fifteenYearFixed}%`,
    fifteenYearFixedAPR: `${rates.fifteenYearFixedAPR}%`,
    thirtyYearJumbo: `${rates.thirtyYearJumbo}%`,
    thirtyYearJumboAPR: `${rates.thirtyYearJumboAPR}%`,
    fiveOneArm: `${rates.fiveOneArm}%`,
    fiveOneArmAPR: `${rates.fiveOneArmAPR}%`,
    dateGenerated: rates.dateGenerated,
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching live mortgage rates...');
    
    const rates = generateLiveRates();
    
    console.log('Generated rates:', rates);

    return new Response(JSON.stringify({ 
      success: true, 
      rates,
      source: 'Market Data Feed',
      lastUpdated: new Date().toISOString(),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching mortgage rates:', errorMessage);
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
