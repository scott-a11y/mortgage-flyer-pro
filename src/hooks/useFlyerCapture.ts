import { useState, useCallback, useEffect } from "react";

// Preload html2canvas module reference
let html2canvasModule: typeof import('html2canvas') | null = null;

export function useFlyerCapture() {
    const [isExporting, setIsExporting] = useState(false);

    // Preload html2canvas on mount for faster captures
    useEffect(() => {
        import('html2canvas').then(module => {
            html2canvasModule = module;
        }).catch(err => {
            console.warn("Failed to preload html2canvas:", err);
        });
    }, []);

    const captureImage = useCallback(async (element: HTMLElement | null): Promise<Blob | null> => {
        if (!element) return null;

        try {
            setIsExporting(true);

            // Use preloaded module or import fresh
            const html2canvas = html2canvasModule?.default
                ?? (await import('html2canvas')).default;

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#ffffff",
                onclone: (clonedDoc) => {
                    const captureEl = clonedDoc.querySelector('[data-capture="flyer"]');
                    if (captureEl instanceof HTMLElement) {
                        captureEl.style.transform = 'none';
                    }
                }
            });

            return new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
        } catch (error) {
            console.error("Flyer capture failed:", error);
            return null;
        } finally {
            setIsExporting(false);
        }
    }, []);

    return { captureImage, isExporting };
}

