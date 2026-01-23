import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { rates, regions, broker, realtor } = await req.json();

    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI API Key missing");
    }

    // Build context from current flyer data
    const rateContext = `
Current Mortgage Rates:
- 30-Year Fixed: ${rates.thirtyYearFixed} (APR: ${rates.thirtyYearFixedAPR})
- 15-Year Fixed: ${rates.fifteenYearFixed} (APR: ${rates.fifteenYearFixedAPR})
- 30-Year Jumbo: ${rates.thirtyYearJumbo} (APR: ${rates.thirtyYearJumboAPR})
- 5/1 ARM: ${rates.fiveOneArm} (APR: ${rates.fiveOneArmAPR})
Date: ${rates.dateGenerated}
    `.trim();

    const regionContext = regions.map((r: { name: string; cities: string }) => `${r.name}: ${r.cities}`).join('\n');

    const professionalContext = `
Mortgage Broker: ${broker.name}, ${broker.title} at ${broker.name}
Realtor: ${realtor.name}, ${realtor.title} at ${realtor.brokerage}
Service Areas: ${regions.map((r: { name: string }) => r.name).join(', ')}
    `.trim();

    const systemPrompt = `You are an elite mortgage marketing strategist and copywriter. You create high-conversion, professional flyer content for top-tier mortgage brokers and real estate partners.

Your copy must:
- Be sophisticated, authoritative, yet accessible.
- Focus on "Strategic Acquisition" and "Wealth Building" rather than just "Interest Rates".
- Use "Power Words" like: Leverage, Opportunity, Strategic, Equity, Portfolio, Acquisition.
- Highlight the synergy between the Mortgage Broker's financial expertise and the Realtor's market knowledge.
- Be extremely concise (respecting max word counts).

Return a JSON object with this exact structure:
{
  "headline": "Punchy headline (max 8 words) focusing on current opportunity",
  "subheading": "Supporting subheading (max 15 words) bridging rates and market value",
  "marketInsight": "Strategic market insight (max 50 words) focused on the current economic climate for buyers",
  "regionInsights": [
    { 
      "name": "Region Name", 
      "insight": "Specific local market driver (max 25 words). E.g., 'Inventory in [City] is shifting, creating a unique window for non-contingent buyers.'" 
    }
  ]
}`;

    const userPrompt = `Generate premium marketing copy for a co-branded flyer.

DATA CONTEXT:
${rateContext}

PARTNERS:
${professionalContext}

SERVICE REGIONS:
${regionContext}

GOALS:
1. Frame the current rate environment as a "Strategic Window of Opportunity".
2. Position the broker (${broker.name}) as a liquidity expert and the realtor (${realtor.name}) as a local market authority.
3. Ensure each region has a distinct, professional insight that feels "insider" and specific.
4. If rates are low, focus on "Buying Power". If rates are steady, focus on "Inventory Advantage".`;

    console.log('Generating market insights with OpenAI...');

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content returned from AI");
    }

    console.log('AI response:', content);

    // Parse the JSON response
    const insights = JSON.parse(content);

    return new Response(JSON.stringify({
      success: true,
      insights
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating market insights:", error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
