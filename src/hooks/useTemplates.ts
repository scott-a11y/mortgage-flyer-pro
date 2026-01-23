/**
 * Custom hook for managing template CRUD operations.
 * Wraps the template service with React state management.
 */

import { useState, useCallback, useEffect } from "react";
import {
    SavedTemplate,
    getAllTemplates,
    saveTemplate,
    deleteTemplate,
    getLocalTemplates,
} from "@/lib/services/templateService";
import { FlyerData } from "@/types/flyer";
import { useErrorHandler } from "@/hooks/useErrorHandler";

interface UseTemplatesOptions {
    /** Load templates on mount */
    loadOnMount?: boolean;
}

interface UseTemplatesResult {
    /** List of all templates */
    templates: SavedTemplate[];
    /** Whether templates are loading */
    isLoading: boolean;
    /** Whether a save operation is in progress */
    isSaving: boolean;
    /** Reload templates from server */
    refresh: () => Promise<void>;
    /** Save a new template */
    save: (name: string, data: FlyerData) => Promise<SavedTemplate | null>;
    /** Delete a template */
    remove: (id: string, source: "cloud" | "local") => Promise<boolean>;
    /** Load a template for editing */
    load: (id: string) => SavedTemplate | undefined;
}

/**
 * Hook for managing flyer templates.
 *
 * @param options - Configuration options
 * @returns Template state and operations
 *
 * @example
 * function TemplateManager() {
 *   const { templates, isLoading, save, remove } = useTemplates();
 *
 *   const handleSave = async () => {
 *     await save("My Template", currentFlyerData);
 *   };
 *
 *   return (
 *     <ul>
 *       {templates.map(t => (
 *         <li key={t.id}>
 *           {t.name}
 *           <button onClick={() => remove(t.id, t.source)}>Delete</button>
 *         </li>
 *       ))}
 *     </ul>
 *   );
 * }
 */
export function useTemplates(
    options: UseTemplatesOptions = { loadOnMount: true }
): UseTemplatesResult {
    const [templates, setTemplates] = useState<SavedTemplate[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { handleError } = useErrorHandler({ showToast: true });

    /**
     * Load all templates from cloud and local storage
     */
    const refresh = useCallback(async () => {
        setIsLoading(true);
        try {
            const allTemplates = await getAllTemplates();
            setTemplates(allTemplates);
        } catch (error) {
            handleError(error, { operation: "loadTemplates" });
            // Fall back to local only
            setTemplates(getLocalTemplates());
        } finally {
            setIsLoading(false);
        }
    }, [handleError]);

    /**
     * Save a new template
     */
    const save = useCallback(
        async (name: string, data: FlyerData): Promise<SavedTemplate | null> => {
            setIsSaving(true);
            try {
                const template = await saveTemplate(name, data);
                setTemplates((prev) => [template, ...prev]);
                return template;
            } catch (error) {
                handleError(error, { operation: "saveTemplate" });
                return null;
            } finally {
                setIsSaving(false);
            }
        },
        [handleError]
    );

    /**
     * Delete a template
     */
    const remove = useCallback(
        async (id: string, source: "cloud" | "local"): Promise<boolean> => {
            try {
                const success = await deleteTemplate(id, source);
                if (success) {
                    setTemplates((prev) => prev.filter((t) => t.id !== id));
                }
                return success;
            } catch (error) {
                handleError(error, { operation: "deleteTemplate" });
                return false;
            }
        },
        [handleError]
    );

    /**
     * Load a specific template by ID
     */
    const load = useCallback(
        (id: string): SavedTemplate | undefined => {
            return templates.find((t) => t.id === id);
        },
        [templates]
    );

    // Load templates on mount if enabled
    useEffect(() => {
        if (options.loadOnMount) {
            refresh();
        }
    }, [options.loadOnMount, refresh]);

    return {
        templates,
        isLoading,
        isSaving,
        refresh,
        save,
        remove,
        load,
    };
}

export default useTemplates;
