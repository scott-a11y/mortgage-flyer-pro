/**
 * Agent Service - Centralized data layer for agent/partner operations.
 */

import { supabase } from "@/integrations/supabase/client";
import { RealtorContact, ColorTheme } from "@/types/flyer";
import { SupabaseError } from "@/lib/errors";

/**
 * Agent profile as stored in Supabase
 */
export interface AgentProfile {
    id: string;
    name: string;
    title: string | null;
    phone: string | null;
    email: string | null;
    brokerage: string | null;
    website: string | null;
    headshot_url: string | null;
    color_primary: string | null;
    color_secondary: string | null;
    color_accent: string | null;
    license_number: string | null;
    created_at: string;
    updated_at: string;
}

/**
 * Agent partner profile for flyer integration
 */
export interface AgentPartner {
    id: string;
    name: string;
    realtor: RealtorContact;
    colorTheme: ColorTheme;
}

/**
 * Result type for agent operations
 */
export interface AgentResult<T> {
    data: T | null;
    error: Error | null;
}

/**
 * Input for creating an agent profile
 */
export interface CreateAgentInput {
    name: string;
    title: string;
    phone: string;
    email: string;
    brokerage: string;
    website?: string;
    license_number?: string;
    headshot_url?: string;
    color_primary?: string;
    color_secondary?: string;
    color_accent?: string;
}

/**
 * Check if Supabase is properly configured
 */
function isSupabaseConfigured(): boolean {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    return Boolean(url && key && !url.includes("placeholder"));
}

/**
 * Convert a database agent profile to an AgentPartner
 */
function toAgentPartner(profile: AgentProfile): AgentPartner {
    return {
        id: profile.id,
        name: profile.name,
        realtor: {
            name: profile.name,
            title: profile.title || "REALTOR®",
            phone: profile.phone || "",
            email: profile.email || "",
            brokerage: profile.brokerage || "",
            website: profile.website || "",
            headshot: profile.headshot_url || "",
        },
        colorTheme: {
            id: `custom-${profile.id}`,
            name: profile.brokerage || "Custom",
            primary: profile.color_primary || "#000000",
            secondary: profile.color_secondary || "#FFFFFF",
            accent: profile.color_accent || "#D4AF37",
        },
    };
}

/**
 * Get all registered agent partners
 */
export async function getAllAgents(): Promise<AgentResult<AgentPartner[]>> {
    if (!isSupabaseConfigured()) {
        return { data: [], error: null };
    }

    const { data, error } = await supabase
        .from("agent_profiles")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        return { data: null, error: new SupabaseError(error.message, error.code) };
    }

    return {
        data: (data || []).map(toAgentPartner),
        error: null,
    };
}

/**
 * Get an agent by ID
 */
export async function getAgentById(id: string): Promise<AgentResult<AgentPartner>> {
    if (!isSupabaseConfigured()) {
        return { data: null, error: new SupabaseError("Supabase not configured") };
    }

    const { data, error } = await supabase
        .from("agent_profiles")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) {
        return { data: null, error: new SupabaseError(error.message, error.code) };
    }

    if (!data) {
        return { data: null, error: null };
    }

    return { data: toAgentPartner(data), error: null };
}

/**
 * Register a new agent partner
 */
export async function createAgent(
    input: CreateAgentInput
): Promise<AgentResult<AgentPartner>> {
    if (!isSupabaseConfigured()) {
        return { data: null, error: new SupabaseError("Supabase not configured") };
    }

    const { data, error } = await supabase
        .from("agent_profiles")
        .insert([{
            name: input.name,
            title: input.title,
            phone: input.phone,
            email: input.email,
            brokerage: input.brokerage,
            website: input.website || null,
            license_number: input.license_number || null,
            headshot_url: input.headshot_url || null,
            color_primary: input.color_primary || null,
            color_secondary: input.color_secondary || null,
            color_accent: input.color_accent || null,
        }])
        .select()
        .single();

    if (error) {
        return { data: null, error: new SupabaseError(error.message, error.code) };
    }

    return { data: toAgentPartner(data), error: null };
}

/**
 * Update an agent profile
 */
export async function updateAgent(
    id: string,
    updates: Partial<CreateAgentInput>
): Promise<AgentResult<AgentPartner>> {
    if (!isSupabaseConfigured()) {
        return { data: null, error: new SupabaseError("Supabase not configured") };
    }

    const { data, error } = await supabase
        .from("agent_profiles")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        return { data: null, error: new SupabaseError(error.message, error.code) };
    }

    return { data: toAgentPartner(data), error: null };
}

/**
 * Delete an agent profile
 */
export async function deleteAgent(id: string): Promise<AgentResult<null>> {
    if (!isSupabaseConfigured()) {
        return { data: null, error: new SupabaseError("Supabase not configured") };
    }

    const { error } = await supabase
        .from("agent_profiles")
        .delete()
        .eq("id", id);

    if (error) {
        return { data: null, error: new SupabaseError(error.message, error.code) };
    }

    return { data: null, error: null };
}
