/**
 * AI Service - Centralized logic for interacting with Google Gemini API.
 * Uses server-side /api/ai/generate endpoint to keep API key out of the client bundle.
 * Falls back to high-quality template-based generation when API is unavailable.
 */

/**
 * Interface for the Ghost Detailer request
 */
export interface GhostDetailRequest {
    propertyData: {
        city: string;
        bedrooms: number;
        bathrooms: number;
        price: string;
        description?: string;
    };
    buyerName: string;
    agentName: string;
}

/**
 * Call the server-side Gemini proxy. Returns the generated text or null on failure.
 */
async function callAI(prompt: string): Promise<string | null> {
    try {
        const res = await fetch('/api/ai/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        if (!res.ok) return null;
        const data = await res.json();
        if (data.fallback) return null; // API key not configured server-side
        return data.text || null;
    } catch {
        return null;
    }
}

/**
 * Premium template-based ghost detail fallback
 * Used when the Gemini API is not configured or fails
 */
function generateFallbackDetail(request: GhostDetailRequest): string {
    const { propertyData, buyerName } = request;
    const { city, bedrooms, bathrooms, price } = propertyData;
    
    const templates = [
        `${buyerName}, this ${bedrooms}-bedroom gem in ${city} is exactly the kind of find we've been hunting for \u2014 the one that checks the boxes you didn't even know you had. At ${price}, the value equation here is genuinely rare. The ${bathrooms} bathrooms give everyone their own space, and the overall flow of this home just works for the lifestyle we discussed. I'd move fast on this one.`,
        
        `I walked through a lot of homes this week, ${buyerName}, and this ${city} property stopped me in my tracks. For ${price}, you're getting ${bedrooms} bedrooms and ${bathrooms} baths in a neighborhood that's only going up. The layout feels intentional \u2014 every room has purpose, and there's a warmth here that photos can't capture. This is the one I'd want you to see twice.`,
        
        `${buyerName}, picture this: morning coffee in your new ${city} kitchen, natural light streaming through while the neighborhood is still quiet. This ${bedrooms}-bed, ${bathrooms}-bath home at ${price} delivers the kind of daily experience we've been searching for. The space is smart, the location is strategic, and the potential here is massive.`,
        
        `Here's what I keep coming back to about this ${city} listing, ${buyerName}: it's not just a house at ${price} \u2014 it's the lifestyle upgrade we mapped out. ${bedrooms} bedrooms means the space plan works long-term, ${bathrooms} baths means no morning bottlenecks, and the neighborhood energy is exactly what you described wanting. Let's talk this one through seriously.`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Generate a personalized agent perspective for a property
 */
export async function generateGhostDetail(request: GhostDetailRequest): Promise<string> {
    const prompt = `
        You are a luxury real estate marketing expert known as the "Ghost Detailer".
        Your task is to write a highly evocative, premium, and personalized agent perspective for a real estate listing.
        
        PROPERTY INFO:
        - City: ${request.propertyData.city}
        - Beds: ${request.propertyData.bedrooms}
        - Baths: ${request.propertyData.bathrooms}
        - Price: ${request.propertyData.price}
        ${request.propertyData.description ? `- Listing Description: ${request.propertyData.description}` : ""}
        
        TARGET AUDIENCE: ${request.buyerName}
        AGENT: ${request.agentName}
        
        GUIDELINES:
        - Use second-person perspective (address the buyer by name).
        - Focus on "lifestyle" and "vibe" rather than just specs.
        - Sound professional yet emotionally resonant.
        - Keep it between 3-5 sentences.
        - Do not use hashtags or overly corporate jargon.
        - Start with something punchy about the home's character in ${request.propertyData.city}.
    `;

    const result = await callAI(prompt);
    if (result) return result;

    // Fall back to template if API call fails or is not configured
    // Simulate a brief delay to feel like AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    return generateFallbackDetail(request);
}
