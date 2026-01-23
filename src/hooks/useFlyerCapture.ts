import { useState, useCallback } from "react";

export function useFlyerCapture() {
    const [isExporting, setIsExporting] = useState(false);

    const captureImage = useCallback(async (element: HTMLElement | null) => {
        if (!element) return null;

        try {
            setIsExporting(true);
            const { default: html2canvas } = await import('html2canvas');

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
