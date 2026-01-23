/**
 * Template Service - Centralized data layer for template operations.
 * Handles both cloud (Supabase) and local storage templates.
 */

import { supabase } from "@/integrations/supabase/client";
import { FlyerData } from "@/types/flyer";
import { SupabaseError } from "@/lib/errors";
import { STORAGE_KEYS } from "@/lib/constants";
import type { Json } from "@/integrations/supabase/types";

/**
 * Saved template structure
 */
export interface SavedTemplate {
    id: string;
    name: string;
    data: FlyerData;
    created_at: string;
    source: "cloud" | "local";
}

/**
 * Result type for template operations
 */
export interface TemplateResult<T> {
    data: T | null;
    error: Error | null;
}

/**
 * Check if Supabase is properly configured
 */
function isSupabaseConfigured(): boolean {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    return Boolean(url && key && !url.includes("placeholder"));
}

// ============================================================================
// LOCAL STORAGE OPERATIONS
// ============================================================================

/**
 * Get all templates from local storage
 */
export function getLocalTemplates(): SavedTemplate[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.FLYER_TEMPLATES_LOCAL);
        if (!stored) return [];

        const templates = JSON.parse(stored) as Array<{
            id: string;
            name: string;
            data: FlyerData;
            created_at?: string;
            createdAt?: string;
        }>;

        return templates.map((t) => ({
            id: t.id,
            name: t.name,
            data: t.data,
            created_at: t.created_at || t.createdAt || new Date().toISOString(),
            source: "local" as const,
        }));
    } catch (error) {
        console.error("Error reading local templates:", error);
        return [];
    }
}

/**
 * Save a template to local storage
 */
export function saveLocalTemplate(
    id: string,
    name: string,
    data: FlyerData
): SavedTemplate {
    const templates = getLocalTemplates();
    const newTemplate: SavedTemplate = {
        id,
        name,
        data,
        created_at: new Date().toISOString(),
        source: "local",
    };

    templates.unshift(newTemplate);
    localStorage.setItem(
        STORAGE_KEYS.FLYER_TEMPLATES_LOCAL,
        JSON.stringify(templates)
    );

    return newTemplate;
}

/**
 * Delete a template from local storage
 */
export function deleteLocalTemplate(id: string): boolean {
    try {
        const templates = getLocalTemplates().filter((t) => t.id !== id);
        localStorage.setItem(
            STORAGE_KEYS.FLYER_TEMPLATES_LOCAL,
            JSON.stringify(templates)
        );
        return true;
    } catch (error) {
        console.error("Error deleting local template:", error);
        return false;
    }
}

// ============================================================================
// CLOUD OPERATIONS
// ============================================================================

/**
 * Get all templates from Supabase
 */
export async function getCloudTemplates(): Promise<TemplateResult<SavedTemplate[]>> {
    if (!isSupabaseConfigured()) {
        return { data: [], error: null };
    }

    const { data, error } = await supabase
        .from("flyer_templates")
        .select("id, name, data, created_at")
        .order("created_at", { ascending: false });

    if (error) {
        return { data: null, error: new SupabaseError(error.message, error.code) };
    }

    return {
        data: (data || []).map((t) => ({
            id: t.id,
            name: t.name,
            data: t.data as unknown as FlyerData,
            created_at: t.created_at,
            source: "cloud" as const,
        })),
        error: null,
    };
}

/**
 * Save a template to Supabase
 */
export async function saveCloudTemplate(
    id: string,
    name: string,
    data: FlyerData
): Promise<TemplateResult<SavedTemplate>> {
    if (!isSupabaseConfigured()) {
        return { data: null, error: new SupabaseError("Supabase not configured") };
    }

    const { data: result, error } = await supabase
        .from("flyer_templates")
        .insert([{
            id,
            name,
            data: data as unknown as Json,
        }])
        .select()
        .single();

    if (error) {
        return { data: null, error: new SupabaseError(error.message, error.code) };
    }

    return {
        data: {
            id: result.id,
            name: result.name,
            data: result.data as unknown as FlyerData,
            created_at: result.created_at,
            source: "cloud",
        },
        error: null,
    };
}

/**
 * Delete a template from Supabase
 */
export async function deleteCloudTemplate(id: string): Promise<TemplateResult<null>> {
    if (!isSupabaseConfigured()) {
        return { data: null, error: new SupabaseError("Supabase not configured") };
    }

    const { error } = await supabase
        .from("flyer_templates")
        .delete()
        .eq("id", id);

    if (error) {
        return { data: null, error: new SupabaseError(error.message, error.code) };
    }

    return { data: null, error: null };
}

// ============================================================================
// COMBINED OPERATIONS
// ============================================================================

/**
 * Get all templates from both cloud and local storage
 */
export async function getAllTemplates(): Promise<SavedTemplate[]> {
    const localTemplates = getLocalTemplates();
    const { data: cloudTemplates } = await getCloudTemplates();

    // Merge, preferring cloud versions for duplicates
    const cloudIds = new Set((cloudTemplates || []).map((t) => t.id));
    const uniqueLocal = localTemplates.filter((t) => !cloudIds.has(t.id));

    return [...(cloudTemplates || []), ...uniqueLocal];
}

/**
 * Save a template to both cloud and local storage
 */
export async function saveTemplate(
    name: string,
    data: FlyerData
): Promise<SavedTemplate> {
    const id = crypto.randomUUID();

    // Always save locally
    const localTemplate = saveLocalTemplate(id, name, data);

    // Try to save to cloud
    if (isSupabaseConfigured()) {
        try {
            await saveCloudTemplate(id, name, data);
        } catch (error) {
            console.warn("Cloud save failed, using local only:", error);
        }
    }

    return localTemplate;
}

/**
 * Delete a template from both cloud and local storage
 */
export async function deleteTemplate(
    id: string,
    source: "cloud" | "local"
): Promise<boolean> {
    if (source === "cloud") {
        const { error } = await deleteCloudTemplate(id);
        if (error) {
            console.error("Error deleting cloud template:", error);
            return false;
        }
    }

    // Also remove from local storage
    deleteLocalTemplate(id);
    return true;
}
