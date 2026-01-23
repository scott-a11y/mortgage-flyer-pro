/**
 * Hook for export/share functionality.
 * Extracts export logic from ExportMenu and ShareableBanner components.
 */

import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { FlyerData } from "@/types/flyer";
import { UI, API, EXPORT } from "@/lib/constants";

/**
 * Export format options
 */
export type ExportFormat = "email" | "social" | "stories" | "facebook" | "png" | "pdf";

/**
 * Export dimensions by format
 */
export const EXPORT_DIMENSIONS: Record<
    Exclude<ExportFormat, "png" | "pdf">,
    { width: number; height: number; scale: number }
> = {
    email: { width: 600, height: 200, scale: 4 },
    social: { width: 1080, height: 1080, scale: 3 },
    stories: { width: 1080, height: 1920, scale: 3 },
    facebook: { width: 1640, height: 624, scale: 3 },
};

/**
 * Result of useFlyerExport hook
 */
export interface UseFlyerExportResult {
    /** Ref to attach to the element to capture */
    captureRef: React.RefObject<HTMLDivElement>;
    /** Whether an export is in progress */
    isExporting: boolean;
    /** Current export format (if exporting) */
    exportingFormat: ExportFormat | null;
    /** Capture element as blob */
    captureAsBlob: (scale?: number) => Promise<Blob | null>;
    /** Download as PNG */
    downloadPng: (filename?: string) => Promise<void>;
    /** Download a banner format */
    downloadBanner: (format: Exclude<ExportFormat, "png" | "pdf">) => Promise<void>;
    /** Share via native share API */
    shareNative: (title: string, text: string, url: string) => Promise<boolean>;
    /** Copy URL to clipboard */
    copyToClipboard: (text: string) => Promise<boolean>;
}

/**
 * Preload all images in a container
 */
async function preloadImages(container: HTMLElement): Promise<void> {
    const images = container.querySelectorAll("img");
    const imagePromises = Array.from(images).map(
        (img) =>
            new Promise<void>((resolve) => {
                if (img.complete && img.naturalHeight !== 0) {
                    resolve();
                } else {
                    const newImg = new Image();
                    newImg.crossOrigin = "anonymous";
                    newImg.onload = () => resolve();
                    newImg.onerror = () => resolve();
                    newImg.src = img.src;
                }
            })
    );
    await Promise.all(imagePromises);
}

/**
 * Hook for flyer export and sharing functionality.
 *
 * @returns Export utilities and state
 *
 * @example
 * function ExportButton({ flyerData }) {
 *   const { captureRef, isExporting, downloadPng } = useFlyerExport();
 *
 *   return (
 *     <div ref={captureRef}>
 *       <FlyerPreview data={flyerData} />
 *       <button onClick={() => downloadPng('my-flyer')} disabled={isExporting}>
 *         {isExporting ? 'Exporting...' : 'Download PNG'}
 *       </button>
 *     </div>
 *   );
 * }
 */
export function useFlyerExport(): UseFlyerExportResult {
    const captureRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [exportingFormat, setExportingFormat] = useState<ExportFormat | null>(null);

    /**
     * Capture the ref element as a blob
     */
    const captureAsBlob = useCallback(
        async (scale = UI.CAPTURE_SCALE.STANDARD): Promise<Blob | null> => {
            if (!captureRef.current) return null;

            try {
                await preloadImages(captureRef.current);
                await new Promise((resolve) => setTimeout(resolve, 200));

                const html2canvas = (await import("html2canvas")).default;
                const canvas = await html2canvas(captureRef.current, {
                    scale,
                    useCORS: true,
                    backgroundColor: "#050505",
                    logging: false,
                    onclone: (clonedDoc) => {
                        const banner = clonedDoc.querySelector('[data-capture="banner"]');
                        if (banner instanceof HTMLElement) {
                            banner.style.transform = "none";
                        }
                    },
                });

                return new Promise<Blob | null>((resolve) =>
                    canvas.toBlob(resolve, "image/png", 1.0)
                );
            } catch (error) {
                console.error("Capture failed:", error);
                return null;
            }
        },
        []
    );

    /**
     * Download as PNG
     */
    const downloadPng = useCallback(
        async (filename = "flyer"): Promise<void> => {
            setIsExporting(true);
            setExportingFormat("png");

            try {
                const blob = await captureAsBlob(UI.CAPTURE_SCALE.HIGH_RES);
                if (!blob) {
                    toast.error("Failed to generate image");
                    return;
                }

                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.download = `${filename}-${Date.now()}.png`;
                link.href = url;
                link.click();
                URL.revokeObjectURL(url);

                toast.success("Image downloaded!");
            } catch (error) {
                console.error("Download failed:", error);
                toast.error("Failed to download image");
            } finally {
                setIsExporting(false);
                setExportingFormat(null);
            }
        },
        [captureAsBlob]
    );

    /**
     * Download a specific banner format
     */
    const downloadBanner = useCallback(
        async (format: Exclude<ExportFormat, "png" | "pdf">): Promise<void> => {
            if (!captureRef.current) return;

            setIsExporting(true);
            setExportingFormat(format);

            try {
                await preloadImages(captureRef.current);
                await new Promise((resolve) => setTimeout(resolve, 200));

                const html2canvas = (await import("html2canvas")).default;
                const dimensions = EXPORT_DIMENSIONS[format];

                const canvas = await html2canvas(captureRef.current, {
                    scale: dimensions.scale,
                    useCORS: true,
                    backgroundColor: "#050505",
                    logging: false,
                    onclone: (clonedDoc) => {
                        const banner = clonedDoc.querySelector('[data-capture="banner"]');
                        if (banner instanceof HTMLElement) {
                            banner.style.transform = "none";
                        }
                    },
                });

                const link = document.createElement("a");
                link.download = `${format}-banner-${Date.now()}.png`;
                link.href = canvas.toDataURL("image/png", 1.0);
                link.click();

                toast.success(`${format} banner downloaded!`);
            } catch (error) {
                console.error("Banner download failed:", error);
                toast.error("Failed to generate banner");
            } finally {
                setIsExporting(false);
                setExportingFormat(null);
            }
        },
        []
    );

    /**
     * Share via native share API
     */
    const shareNative = useCallback(
        async (title: string, text: string, url: string): Promise<boolean> => {
            if (!navigator.share) {
                toast.error("Sharing not supported on this device");
                return false;
            }

            try {
                await navigator.share({ title, text, url });
                return true;
            } catch (error) {
                if ((error as Error).name !== "AbortError") {
                    console.error("Share failed:", error);
                }
                return false;
            }
        },
        []
    );

    /**
     * Copy text to clipboard
     */
    const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Copied to clipboard!");
            return true;
        } catch (error) {
            console.error("Copy failed:", error);
            toast.error("Failed to copy to clipboard");
            return false;
        }
    }, []);

    return {
        captureRef,
        isExporting,
        exportingFormat,
        captureAsBlob,
        downloadPng,
        downloadBanner,
        shareNative,
        copyToClipboard,
    };
}

export default useFlyerExport;
