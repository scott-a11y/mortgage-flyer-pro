/**
 * AI Service - Centralized logic for interacting with Google Gemini API.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
 * Generate a personalized agent perspective for a property
 */
export async function generateGhostDetail(request: GhostDetailRequest): Promise<string> {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
        throw new Error("Gemini API key not configured");
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
        throw new Error("Failed to generate perspective. Please try again later.");
    }
}
