import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { rates, regions, broker, realtor } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
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

    console.log('Generating market insights with AI...');

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
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
