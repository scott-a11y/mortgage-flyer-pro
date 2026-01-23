/**
 * Flyer Service - Centralized data layer for flyer operations.
 * All Supabase flyer queries should go through this service.
 */

import { supabase } from "@/integrations/supabase/client";
import { FlyerData } from "@/types/flyer";
import { handleError, safeAsync } from "@/lib/errorHandler";
import { SupabaseError } from "@/lib/errors";
import type { Json } from "@/integrations/supabase/types";

/**
 * Flyer template as stored in Supabase
 */
export interface FlyerTemplate {
    id: string;
    name: string;
    slug: string | null;
    data: FlyerData;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

/**
 * Options for fetching flyers
 */
export interface FetchFlyerOptions {
    /** Only return published flyers */
    publishedOnly?: boolean;
}

/**
 * Result of a flyer operation
 */
export interface FlyerResult<T> {
    data: T | null;
    error: Error | null;
}

/**
 * Check if Supabase is properly configured
 */
export function isSupabaseConfigured(): boolean {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    return Boolean(url && key && !url.includes("placeholder"));
}

/**
 * Fetch a flyer by its slug
 * @param slug - The unique slug identifier
 * @param options - Fetch options
 */
export async function getFlyerBySlug(
    slug: string,
    options: FetchFlyerOptions = { publishedOnly: true }
): Promise<FlyerResult<FlyerTemplate>> {
    if (!isSupabaseConfigured()) {
        return { data: null, error: new SupabaseError("Supabase not configured") };
    }

    let query = supabase
        .from("flyer_templates")
        .select("*")
        .eq("slug", slug);

    if (options.publishedOnly) {
        query = query.eq("is_published", true);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
        return { data: null, error: new SupabaseError(error.message, error.code) };
    }

    if (!data) {
        return { data: null, error: null };
    }

    return {
        data: {
            ...data,
            data: data.data as unknown as FlyerData,
        } as FlyerTemplate,
        error: null,
    };
}

/**
 * Fetch a flyer by its ID
 * @param id - The unique ID
 */
export async function getFlyerById(id: string): Promise<FlyerResult<FlyerTemplate>> {
    if (!isSupabaseConfigured()) {
        return { data: null, error: new SupabaseError("Supabase not configured") };
    }

    const { data, error } = await supabase
        .from("flyer_templates")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) {
        return { data: null, error: new SupabaseError(error.message, error.code) };
    }

    if (!data) {
        return { data: null, error: null };
    }

    return {
        data: {
            ...data,
            data: data.data as unknown as FlyerData,
        } as FlyerTemplate,
        error: null,
    };
}

/**
 * Fetch all flyer templates
 * @param options - Fetch options
 */
export async function getAllFlyers(
    options: FetchFlyerOptions = {}
): Promise<FlyerResult<FlyerTemplate[]>> {
    if (!isSupabaseConfigured()) {
        return { data: [], error: null };
    }

    let query = supabase
        .from("flyer_templates")
        .select("*")
        .order("created_at", { ascending: false });

    if (options.publishedOnly) {
        query = query.eq("is_published", true);
    }

    const { data, error } = await query;

    if (error) {
        return { data: null, error: new SupabaseError(error.message, error.code) };
    }

    return {
        data: (data || []).map((item) => ({
            ...item,
            data: item.data as unknown as FlyerData,
        })) as FlyerTemplate[],
        error: null,
    };
}

/**
 * Create a new flyer template
 * @param name - Template name
 * @param flyerData - The flyer data to save
 * @param slug - Optional URL slug
 */
export async function createFlyer(
    name: string,
    flyerData: FlyerData,
    slug?: string
): Promise<FlyerResult<FlyerTemplate>> {
    if (!isSupabaseConfigured()) {
        return { data: null, error: new SupabaseError("Supabase not configured") };
    }

    const { data, error } = await supabase
        .from("flyer_templates")
        .insert([{
            name,
            slug: slug || null,
            data: flyerData as unknown as Json,
            is_published: false,
        }])
        .select()
        .single();

    if (error) {
        return { data: null, error: new SupabaseError(error.message, error.code) };
    }

    return {
        data: {
            ...data,
            data: data.data as unknown as FlyerData,
        } as FlyerTemplate,
        error: null,
    };
}

/**
 * Update an existing flyer template
 * @param id - Template ID
 * @param updates - Fields to update
 */
export async function updateFlyer(
    id: string,
    updates: Partial<Pick<FlyerTemplate, "name" | "slug" | "data" | "is_published">>
): Promise<FlyerResult<FlyerTemplate>> {
    if (!isSupabaseConfigured()) {
        return { data: null, error: new SupabaseError("Supabase not configured") };
    }

    const updateData: Record<string, unknown> = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.slug !== undefined) updateData.slug = updates.slug;
    if (updates.is_published !== undefined) updateData.is_published = updates.is_published;
    if (updates.data !== undefined) updateData.data = updates.data as unknown as Json;

    const { data, error } = await supabase
        .from("flyer_templates")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        return { data: null, error: new SupabaseError(error.message, error.code) };
    }

    return {
        data: {
            ...data,
            data: data.data as unknown as FlyerData,
        } as FlyerTemplate,
        error: null,
    };
}

/**
 * Publish a flyer (make it accessible via slug)
 * @param id - Template ID
 * @param slug - URL-friendly slug
 */
export async function publishFlyer(
    id: string,
    slug: string
): Promise<FlyerResult<FlyerTemplate>> {
    return updateFlyer(id, { slug, is_published: true });
}

/**
 * Unpublish a flyer
 * @param id - Template ID
 */
export async function unpublishFlyer(id: string): Promise<FlyerResult<FlyerTemplate>> {
    return updateFlyer(id, { is_published: false });
}

/**
 * Delete a flyer template
 * @param id - Template ID
 */
export async function deleteFlyer(id: string): Promise<FlyerResult<null>> {
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

/**
 * Track a flyer view for analytics
 * @param slug - The flyer slug
 * @param referrer - Optional referrer URL
 * @param userAgent - Optional user agent string
 */
export async function trackFlyerView(
    slug: string,
    referrer?: string,
    userAgent?: string
): Promise<void> {
    if (!isSupabaseConfigured()) return;

    try {
        await supabase.from("flyer_analytics").insert([{
            flyer_slug: slug,
            referrer: referrer || null,
            user_agent: userAgent || null,
        }]);
    } catch (error) {
        // Silently fail - analytics should not break the app
        console.warn("Failed to track flyer view:", error);
    }
}
