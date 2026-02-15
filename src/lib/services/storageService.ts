/**
 * Storage Service - Handles file uploads to Supabase Storage
 */

import { supabase } from "@/integrations/supabase/client";

const BUCKET_NAME = "media";

export interface UploadResult {
    url: string | null;
    error: Error | null;
}

/**
 * Upload a file to the media bucket
 */
export async function uploadFile(
    file: File,
    folder: string,
    fileName?: string
): Promise<UploadResult> {
    try {
        const ext = file.name.split(".").pop()?.toLowerCase() || "png";
        const safeName = fileName
            ? `${fileName}.${ext}`
            : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const path = `${folder}/${safeName}`;

        const { error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(path, file, {
                cacheControl: "3600",
                upsert: true,
            });

        if (uploadError) {
            return { url: null, error: new Error(uploadError.message) };
        }

        const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(path);

        return { url: urlData.publicUrl, error: null };
    } catch (err) {
        return { url: null, error: err as Error };
    }
}

/**
 * Upload an agent headshot
 */
export async function uploadHeadshot(
    file: File,
    agentSlug: string
): Promise<UploadResult> {
    return uploadFile(file, "headshots", agentSlug);
}

/**
 * Upload a property photo
 */
export async function uploadPropertyPhoto(
    file: File,
    propertySlug: string,
    photoType: "hero" | "kitchen" | "bath" | "backyard" | "secondary"
): Promise<UploadResult> {
    return uploadFile(file, `properties/${propertySlug}`, photoType);
}

/**
 * Delete a file from storage
 */
export async function deleteFile(path: string): Promise<{ error: Error | null }> {
    try {
        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([path]);
        return { error: error ? new Error(error.message) : null };
    } catch (err) {
        return { error: err as Error };
    }
}
