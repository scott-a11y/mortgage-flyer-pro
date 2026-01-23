/**
 * Custom hook for managing banner data and capture functionality.
 * Centralizes shared logic between all banner components.
 */

import { useMemo, useRef, useCallback, useState } from "react";
import { FlyerData } from "@/types/flyer";
import { EXPORT, UI } from "@/lib/constants";

/**
 * Formatted rate data ready for display in banners
 */
export interface BannerRates {
    /** 30-Year Jumbo rate (without %) */
    jumbo: string;
    /** 30-Year Fixed rate (without %) */
    conventional: string;
    /** 15-Year Fixed rate (without %) */
    fifteenYear: string;
    /** FHA rate (without %) */
    fha: string;
    /** VA rate (without %) */
    va: string;
}

/**
 * Contact info formatted for banners
 */
export interface BannerContact {
    name: string;
    title: string;
    headshot?: string;
    headshotPosition?: number;
    phone?: string;
    email?: string;
    nmls?: string;
    brokerage?: string;
}

/**
 * All data needed by banner components
 */
export interface BannerData {
    /** Broker/officer contact info */
    broker: BannerContact;
    /** Realtor/agent contact info */
    realtor: BannerContact;
    /** Formatted rate values */
    rates: BannerRates;
    /** Company info */
    company: {
        name: string;
        nmls: string;
        logo?: string;
        website?: string;
    };
    /** Color theme for branding */
    theme: {
        primary: string;
        secondary: string;
        accent: string;
    };
    /** Date rates were generated */
    dateGenerated: string;
}

/**
 * Options for the useBannerData hook
 */
export interface UseBannerDataOptions {
    /** Share URL for QR codes */
    shareUrl?: string;
    /** Whether to enable capture functionality */
    enableCapture?: boolean;
}

/**
 * Return type for useBannerData hook
 */
export interface UseBannerDataResult {
    /** Formatted banner data */
    bannerData: BannerData;
    /** Formatted rates for quick access */
    rates: BannerRates;
    /** Share URL for QR codes */
    shareUrl: string;
    /** Ref to attach to banner element for capture */
    bannerRef: React.RefObject<HTMLDivElement>;
    /** Whether capture is in progress */
    isCapturing: boolean;
    /** Capture the banner as an image */
    captureBanner: () => Promise<Blob | null>;
    /** Download the banner as PNG */
    downloadBanner: (filename?: string) => Promise<void>;
}

/**
 * Default theme colors
 */
const DEFAULT_THEME = {
    primary: "#D4AF37", // Gold
    secondary: "#050505", // Onyx
    accent: "#D4AF37",
};

/**
 * Strip percentage sign from rate string
 */
function formatRate(rate: string | undefined): string {
    if (!rate) return "0.00";
    return rate.replace("%", "").trim();
}

/**
 * Hook for managing banner data and capture functionality.
 *
 * @param flyerData - The flyer data to format for banners
 * @param options - Additional options
 * @returns Banner data, refs, and capture utilities
 *
 * @example
 * function MyBanner({ flyerData, shareUrl }) {
 *   const { bannerData, rates, bannerRef, downloadBanner } = useBannerData(flyerData, { shareUrl });
 *
 *   return (
 *     <div ref={bannerRef}>
 *       <h1>{bannerData.broker.name}</h1>
 *       <span>{rates.jumbo}%</span>
 *       <button onClick={() => downloadBanner('my-banner')}>Download</button>
 *     </div>
 *   );
 * }
 */
export function useBannerData(
    flyerData: FlyerData,
    options: UseBannerDataOptions = {}
): UseBannerDataResult {
    const { shareUrl = "", enableCapture = true } = options;

    const bannerRef = useRef<HTMLDivElement>(null);
    const [isCapturing, setIsCapturing] = useState(false);

    // Format rates for display
    const rates = useMemo<BannerRates>(
        () => ({
            jumbo: formatRate(flyerData.rates.thirtyYearJumbo),
            conventional: formatRate(flyerData.rates.thirtyYearFixed),
            fifteenYear: formatRate(flyerData.rates.fifteenYearFixed),
            fha: formatRate(flyerData.rates.fha),
            va: formatRate(flyerData.rates.va),
        }),
        [flyerData.rates]
    );

    // Format all banner data
    const bannerData = useMemo<BannerData>(
        () => ({
            broker: {
                name: flyerData.broker.name,
                title: flyerData.broker.title,
                headshot: flyerData.broker.headshot,
                headshotPosition: flyerData.broker.headshotPosition,
                phone: flyerData.broker.phone,
                email: flyerData.broker.email,
                nmls: flyerData.broker.nmls,
            },
            realtor: {
                name: flyerData.realtor.name,
                title: flyerData.realtor.title,
                headshot: flyerData.realtor.headshot,
                headshotPosition: flyerData.realtor.headshotPosition,
                phone: flyerData.realtor.phone,
                email: flyerData.realtor.email,
                brokerage: flyerData.realtor.brokerage,
            },
            rates,
            company: {
                name: flyerData.company.name,
                nmls: flyerData.company.nmls,
                logo: flyerData.company.logo,
                website: flyerData.company.website,
            },
            theme: flyerData.colorTheme
                ? {
                    primary: flyerData.colorTheme.primary,
                    secondary: flyerData.colorTheme.secondary,
                    accent: flyerData.colorTheme.accent,
                }
                : DEFAULT_THEME,
            dateGenerated: flyerData.rates.dateGenerated,
        }),
        [flyerData, rates]
    );

    // Capture banner as blob
    const captureBanner = useCallback(async (): Promise<Blob | null> => {
        if (!enableCapture || !bannerRef.current) return null;

        setIsCapturing(true);
        try {
            const html2canvas = (await import("html2canvas")).default;

            const canvas = await html2canvas(bannerRef.current, {
                scale: UI.CAPTURE_SCALE.HIGH_RES,
                useCORS: true,
                backgroundColor: bannerData.theme.secondary,
                logging: false,
            });

            return new Promise<Blob | null>((resolve) =>
                canvas.toBlob(resolve, "image/png", 1.0)
            );
        } catch (error) {
            console.error("Banner capture failed:", error);
            return null;
        } finally {
            setIsCapturing(false);
        }
    }, [enableCapture, bannerData.theme.secondary]);

    // Download banner as PNG
    const downloadBanner = useCallback(
        async (filename?: string): Promise<void> => {
            const blob = await captureBanner();
            if (!blob) return;

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${filename || "banner"}-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        },
        [captureBanner]
    );

    return {
        bannerData,
        rates,
        shareUrl,
        bannerRef,
        isCapturing,
        captureBanner,
        downloadBanner,
    };
}

export default useBannerData;
