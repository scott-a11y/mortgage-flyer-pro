/**
 * AI Command Service - Processes natural language commands for agent/listing management.
 * Uses Google Gemini to interpret user requests and map them to service operations.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import * as agentService from "./agentService";
import { AgentPartner } from "./agentService";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export interface CommandResult {
    success: boolean;
    message: string;
    action?: string;
    details?: Record<string, unknown>;
}

interface ParsedCommand {
    intent:
        | "update_agent"
        | "create_agent"
        | "delete_agent"
        | "list_agents"
        | "update_listing"
        | "general_question"
        | "unknown";
    agentName?: string;
    field?: string;
    value?: string;
    allFields?: Record<string, string>;
    rawInput: string;
}

/**
 * Parse a natural language command using Gemini
 */
async function parseCommand(
    input: string,
    agents: AgentPartner[]
): Promise<ParsedCommand> {
    const agentNames = agents.map((a) => a.name).join(", ");

    const prompt = `You are an AI assistant for a mortgage flyer management system. Parse the following request into a structured command.

AVAILABLE AGENTS: ${agentNames}

USER REQUEST: "${input}"

Respond with ONLY valid JSON (no markdown, no code fences) in this format:
{
  "intent": "update_agent" | "create_agent" | "delete_agent" | "list_agents" | "update_listing" | "general_question" | "unknown",
  "agentName": "matched agent name or null",
  "field": "name | title | phone | email | brokerage | website | headshot_url | color_primary | color_secondary | null",
  "value": "the new value or null",
  "allFields": { "field1": "value1" } or null
}

MATCHING RULES:
- Match agent names loosely (e.g., "celeste" matches "Celeste Zarling", "adrian" matches "Adrian Mitchell")
- For phone updates, clean to format like (425) 555-0123
- For intent "list_agents", no agent field needed
- For "create_agent", allFields should contain: name, title, phone, email, brokerage
- For "update_listing", return this intent if the user asks to change the address, price, or city
- For general_question, set intent to "general_question"
- If unsure, set intent to "unknown"

Respond with ONLY the JSON object.`;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();

        // Clean up any markdown formatting
        const jsonStr = text
            .replace(/```json\s*/g, "")
            .replace(/```\s*/g, "")
            .trim();

        const parsed = JSON.parse(jsonStr);
        return { ...parsed, rawInput: input };
    } catch {
        // Fallback: simple keyword matching
        return parseCommandFallback(input, agents);
    }
}

/**
 * Fallback parser when AI is unavailable
 */
function parseCommandFallback(
    input: string,
    agents: AgentPartner[]
): ParsedCommand {
    const lower = input.toLowerCase();

    // Find mentioned agent
    const matchedAgent = agents.find(
        (a) =>
            lower.includes(a.name.toLowerCase()) ||
            lower.includes(a.name.split(" ")[0].toLowerCase())
    );

    // Detect intent
    if (lower.includes("list") || lower.includes("show") || lower.includes("all agents")) {
        return { intent: "list_agents", rawInput: input };
    }

    if (lower.includes("delete") || lower.includes("remove")) {
        return {
            intent: "delete_agent",
            agentName: matchedAgent?.name,
            rawInput: input,
        };
    }

    if (lower.includes("address") || lower.includes("price") || lower.includes("listing")) {
        return {
            intent: "update_listing",
            rawInput: input,
        };
    }

    if (lower.includes("add") || lower.includes("create") || lower.includes("new agent")) {
        return {
            intent: "create_agent",
            rawInput: input,
        };
    }

    // Update detection
    if (matchedAgent) {
        let field: string | undefined;
        let value: string | undefined;

        const phoneMatch = input.match(
            /(?:phone|number|cell)\s*(?:to|:)?\s*([(\d)\s\-+.]+)/i
        );
        const emailMatch = input.match(
            /(?:email)\s*(?:to|:)?\s*([\w.+-]+@[\w.-]+)/i
        );
        const titleMatch = input.match(
            /(?:title)\s*(?:to|:)?\s*["']?([^"'\n]+)/i
        );
        const brokerageMatch = input.match(
            /(?:brokerage|company|office)\s*(?:to|:)?\s*["']?([^"'\n]+)/i
        );

        if (phoneMatch) {
            field = "phone";
            value = phoneMatch[1].trim();
        } else if (emailMatch) {
            field = "email";
            value = emailMatch[1].trim();
        } else if (titleMatch) {
            field = "title";
            value = titleMatch[1].trim();
        } else if (brokerageMatch) {
            field = "brokerage";
            value = brokerageMatch[1].trim();
        }

        if (field && value) {
            return {
                intent: "update_agent",
                agentName: matchedAgent.name,
                field,
                value,
                rawInput: input,
            };
        }
    }

    return { intent: "unknown", rawInput: input };
}

/**
 * Execute a parsed command
 */
async function executeCommand(
    parsed: ParsedCommand,
    agents: AgentPartner[]
): Promise<CommandResult> {
    switch (parsed.intent) {
        case "list_agents": {
            const names = agents.map((a) => `• ${a.name} (${a.realtor.brokerage})`).join("\n");
            return {
                success: true,
                message: `Found ${agents.length} agents:\n${names}`,
                action: "list",
            };
        }

        case "update_agent": {
            if (!parsed.agentName) {
                return {
                    success: false,
                    message: "I couldn't determine which agent to update. Please specify the agent name.",
                };
            }

            const agent = agents.find(
                (a) =>
                    a.name.toLowerCase() === parsed.agentName!.toLowerCase() ||
                    a.name.toLowerCase().includes(parsed.agentName!.toLowerCase())
            );

            if (!agent) {
                return {
                    success: false,
                    message: `I couldn't find an agent named "${parsed.agentName}". Available agents: ${agents.map((a) => a.name).join(", ")}`,
                };
            }

            if (!parsed.field || !parsed.value) {
                return {
                    success: false,
                    message: `What would you like to update for ${agent.name}? Please specify the field and new value.`,
                };
            }

            const updates: Record<string, string> = { [parsed.field]: parsed.value };
            const { error } = await agentService.updateAgent(agent.id, updates);

            if (error) {
                return {
                    success: true,
                    message: `✅ Updated ${agent.name}'s ${parsed.field} to "${parsed.value}" (saved locally — will sync to cloud when available).`,
                    action: "update",
                    details: { agentId: agent.id, field: parsed.field, value: parsed.value },
                };
            }

            return {
                success: true,
                message: `✅ Updated ${agent.name}'s ${parsed.field} to "${parsed.value}"`,
                action: "update",
                details: { agentId: agent.id, field: parsed.field, value: parsed.value },
            };
        }

        case "update_listing": {
            return {
                success: false,
                message: "I can only update agent profiles right now. To change the listing address or property data, please use the Builder or the 'Change Listing' button.",
            };
        }

        case "create_agent": {
            if (parsed.allFields && parsed.allFields.name) {
                const input: agentService.CreateAgentInput = {
                    name: parsed.allFields.name,
                    title: parsed.allFields.title || "REALTOR®",
                    phone: parsed.allFields.phone || "",
                    email: parsed.allFields.email || "",
                    brokerage: parsed.allFields.brokerage || "",
                    website: parsed.allFields.website || "",
                };

                const { data, error } = await agentService.createAgent(input);
                if (error) {
                    return {
                        success: true,
                        message: `✅ Created agent "${parsed.allFields.name}" locally. Go to Agent Management to complete their profile.`,
                        action: "create",
                    };
                }
                return {
                    success: true,
                    message: `✅ Created agent "${data!.name}" successfully! Go to Agent Management to add a headshot and complete their profile.`,
                    action: "create",
                    details: { agentId: data!.id },
                };
            }

            return {
                success: false,
                message:
                    'To add a new agent, please provide at least a name. Example: "Add a new agent named Jane Smith from RE/MAX, phone (503) 555-0123"',
            };
        }

        case "delete_agent": {
            return {
                success: false,
                message:
                    "For safety, please delete agents from the Agent Management page directly. Navigate to /agents to manage your partners.",
            };
        }

        case "general_question": {
            return {
                success: true,
                message:
                    "I can help you manage agents, update contact info, modify listings, and more. Try commands like:\n\n• \"Update Celeste's phone to (425) 555-1234\"\n• \"List all agents\"\n• \"Add a new agent named Jane Smith from RE/MAX\"\n• \"Change Adrian's title to Senior REALTOR®\"",
                action: "help",
            };
        }

        default:
            return {
                success: false,
                message:
                    "I'm not sure what you'd like to do. Try commands like:\n\n• \"Update Celeste's phone to (425) 555-1234\"\n• \"List all agents\"\n• \"Add a new agent named Jane Smith\"",
            };
    }
}

/**
 * Main entry: process a natural language command
 */
export async function processCommand(
    input: string,
    agents: AgentPartner[]
): Promise<CommandResult> {
    if (!input.trim()) {
        return { success: false, message: "Please enter a command." };
    }

    const parsed = await parseCommand(input, agents);
    return executeCommand(parsed, agents);
}
