import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// HARDCODED FOR TESTING - MOVE TO ENV VAR IN PRODUCTION
const OPENAI_API_KEY = "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";

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

    const systemPrompt = `You are an expert mortgage marketing copywriter who creates compelling, professional flyer content for mortgage brokers and real estate agents. Your copy should:
- Be concise, impactful, and action-oriented
- Highlight the value proposition of current rates
- Create urgency without being pushy
- Sound professional and trustworthy
- Be appropriate for a co-branded mortgage/realtor flyer

Always return a JSON object with this exact structure:
{
  "headline": "A punchy, attention-grabbing headline (max 8 words)",
  "subheading": "A supporting subheading that expands on the value (max 15 words)",
  "marketInsight": "A brief market insight paragraph (2-3 sentences, max 50 words)",
  "regionInsights": [
    { "name": "Region Name", "insight": "Brief local market insight (max 20 words)" }
  ]
}`;

    const userPrompt = `Generate compelling marketing copy for a co-branded mortgage rate flyer based on this data:

${rateContext}

${professionalContext}

Service Regions:
${regionContext}

Create engaging copy that:
1. Highlights the current rate environment
2. Creates a sense of opportunity
3. Positions both the broker and realtor as trusted advisors
4. Includes region-specific insights for each service area`;

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
