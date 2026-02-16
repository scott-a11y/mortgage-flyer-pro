/**
 * AI Service - Centralized logic for interacting with Google Gemini API.
 * Falls back to high-quality template-based generation when API key is unavailable.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API (will be null if no key)
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const model = genAI?.getGenerativeModel({ model: "gemini-1.5-flash" });

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
 * Premium template-based ghost detail fallback
 * Used when the Gemini API key is not configured
 */
function generateFallbackDetail(request: GhostDetailRequest): string {
    const { propertyData, buyerName } = request;
    const { city, bedrooms, bathrooms, price } = propertyData;
    
    const templates = [
        `${buyerName}, this ${bedrooms}-bedroom gem in ${city} is exactly the kind of find we've been hunting for — the one that checks the boxes you didn't even know you had. At ${price}, the value equation here is genuinely rare. The ${bathrooms} bathrooms give everyone their own space, and the overall flow of this home just works for the lifestyle we discussed. I'd move fast on this one.`,
        
        `I walked through a lot of homes this week, ${buyerName}, and this ${city} property stopped me in my tracks. For ${price}, you're getting ${bedrooms} bedrooms and ${bathrooms} baths in a neighborhood that's only going up. The layout feels intentional — every room has purpose, and there's a warmth here that photos can't capture. This is the one I'd want you to see twice.`,
        
        `${buyerName}, picture this: morning coffee in your new ${city} kitchen, natural light streaming through while the neighborhood is still quiet. This ${bedrooms}-bed, ${bathrooms}-bath home at ${price} delivers the kind of daily experience we've been searching for. The space is smart, the location is strategic, and the potential here is massive.`,
        
        `Here's what I keep coming back to about this ${city} listing, ${buyerName}: it's not just a house at ${price} — it's the lifestyle upgrade we mapped out. ${bedrooms} bedrooms means the space plan works long-term, ${bathrooms} baths means no morning bottlenecks, and the neighborhood energy is exactly what you described wanting. Let's talk this one through seriously.`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Generate a personalized agent perspective for a property
 */
export async function generateGhostDetail(request: GhostDetailRequest): Promise<string> {
    // If no API key, use template fallback instead of throwing an error
    if (!apiKey || !model) {
        console.log("Ghost Detailer: Using template-based generation (no API key configured)");
        // Simulate a brief delay to feel like AI processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        return generateFallbackDetail(request);
    }

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

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("AI Generation Error:", error);
        // Fall back to template if API call fails
        console.log("Ghost Detailer: Falling back to template-based generation");
        return generateFallbackDetail(request);
    }
}
