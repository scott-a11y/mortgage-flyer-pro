/**
 * Centralized application constants.
 * All magic numbers, default values, and configuration should be defined here.
 */

// ============================================================================
// DEFAULT BROKER/OFFICER CONTACT INFO
// ============================================================================
export const DEFAULT_OFFICER = {
    NAME: "Scott Little",
    TITLE: "Mortgage Broker",
    PHONE: "(360) 606-1106",
    EMAIL: "scott@ialoans.com",
    NMLS: "130371",
} as const;

export const DEFAULT_COMPANY = {
    NAME: "IA Mortgage",
    PHONE: "(360) 606-1106",
    WEBSITE: "www.iamortgage.org",
    NMLS: "1731464",
} as const;

// ============================================================================
// FLYER DEFAULTS
// ============================================================================
export const FLYER_DEFAULTS = {
    /** Default mortgage rates (fallback values) */
    RATES: {
        THIRTY_YEAR_FIXED: "6.125%",
        THIRTY_YEAR_FIXED_APR: "6.325%",
        FIFTEEN_YEAR_FIXED: "5.790%",
        FIFTEEN_YEAR_FIXED_APR: "5.99%",
        THIRTY_YEAR_JUMBO: "6.425%",
        THIRTY_YEAR_JUMBO_APR: "6.625%",
        FIVE_ONE_ARM: "5.72%",
        FIVE_ONE_ARM_APR: "6.85%",
        FHA: "5.50%",
        FHA_APR: "6.68%",
        VA: "5.50%",
        VA_APR: "5.72%",
    },
    /** Default layout type */
    LAYOUT: "luxury" as const,
    /** Default rate type to display */
    RATE_TYPE: "jumbo" as const,
    /** Default headshot position (0-100) */
    HEADSHOT_POSITION: 50,
    /** Broker headshot position override */
    BROKER_HEADSHOT_POSITION: 10,
    /** Realtor headshot position override */
    REALTOR_HEADSHOT_POSITION: 40,
} as const;

// ============================================================================
// BRIDGE CALCULATOR CONFIG
// ============================================================================
export const BRIDGE_CALC_CONFIG = {
    /** Estimated selling costs as percentage of home value (commissions + closing) */
    SELLING_COSTS_PERCENTAGE: 0.07,
    /** Maximum LTV (Loan-to-Value) ratio for bridge loans */
    MAX_BRIDGE_LTV_PERCENTAGE: 0.75,
    /** LTV thresholds for strategic advice */
    LTV_THRESHOLDS: {
        EXCELLENT: 50, // Below 50% = excellent equity position
        STRONG: 70, // Below 70% = strong leverage available
    },
    /** Slider configuration */
    SLIDER: {
        HOME_VALUE: { MIN: 200000, MAX: 3000000, STEP: 10000 },
        MORTGAGE: { STEP: 10000 },
    },
    /** Default values */
    DEFAULTS: {
        HOME_VALUE: 750000,
        MORTGAGE_BALANCE: 450000,
    },
} as const;

// ============================================================================
// UI CONSTANTS
// ============================================================================
export const UI = {
    /** Toast notification duration in ms */
    TOAST_DURATION_MS: 5000,
    /** Debounce delay for input fields */
    DEBOUNCE_MS: 300,
    /** Maximum file size for uploads (5MB) */
    MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024,
    MAX_FILE_SIZE_MB: 5,
    /** Supported image types for upload */
    SUPPORTED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"] as const,
    /** Animation durations */
    ANIMATION: {
        FAST_MS: 150,
        NORMAL_MS: 300,
        SLOW_MS: 500,
    },
    /** Dialog close delay for cleanup */
    DIALOG_CLOSE_DELAY_MS: 200,
    /** html2canvas scale for high-res captures */
    CAPTURE_SCALE: {
        STANDARD: 2,
        HIGH_RES: 4,
    },
} as const;

// ============================================================================
// API / NETWORK CONSTANTS
// ============================================================================
export const API = {
    /** Number of retry attempts for failed requests */
    RETRY_ATTEMPTS: 3,
    /** Request timeout in milliseconds */
    TIMEOUT_MS: 10000,
    /** Analytics tracking delay */
    ANALYTICS_DELAY_MS: 1000,
    /** Image preload timeout */
    IMAGE_TIMEOUT_MS: 15000,
    /** Download cleanup delay (allows browser to start download) */
    DOWNLOAD_CLEANUP_DELAY_MS: 2000,
} as const;

// ============================================================================
// LICENSED STATES & REFERRAL CONFIG
// ============================================================================
export const LICENSING = {
    /** States where we are licensed to operate directly */
    LICENSED_STATES: ["OR", "WA", "ID"] as const,
} as const;

// ============================================================================
// EXPORT FORMATS
// ============================================================================
export const EXPORT = {
    /** Banner capture dimensions */
    BANNER: {
        WIDTH: 600,
        HEIGHT: 220,
        SCALE: 0.72,
    },
    /** Social card dimensions */
    SOCIAL_CARD: {
        WIDTH: 1080,
        HEIGHT: 1080,
    },
    /** QR code size */
    QR_CODE_SIZE: 32,
} as const;

// ============================================================================
// FEATURE FLAGS
// ============================================================================
export const FEATURES = {
    /** Enable AI-powered market insights */
    ENABLE_AI_INSIGHTS: true,
    /** Enable PDF export functionality */
    ENABLE_EXPORT_PDF: true,
    /** Enable Vercel Analytics tracking */
    ENABLE_ANALYTICS: true,
    /** Show debug console logs in development */
    ENABLE_DEBUG_LOGS: process.env.NODE_ENV === "development",
} as const;

// ============================================================================
// ROUTE PATHS
// ============================================================================
export const ROUTES = {
    HOME: "/",
    FLYER: "/flyer/:slug",
    LIVE_FLYER: "/live/:slug",
    NOT_FOUND: "*",
} as const;

// ============================================================================
// LOCAL STORAGE KEYS
// ============================================================================
export const STORAGE_KEYS = {
    FLYER_TEMPLATES_LOCAL: "flyer_templates_local",
} as const;

// ============================================================================
// PLACEHOLDER IMAGES
// ============================================================================
export const PLACEHOLDERS = {
    BROKER_HEADSHOT: "/placeholder-scott.jpg",
    REALTOR_HEADSHOT: "/placeholder-realtor.jpg",
} as const;

// ============================================================================
// PRODUCTION URLS
// ============================================================================
export const URLS = {
    PRODUCTION_BASE: "https://mortgage-flyer-pro.vercel.app",
} as const;
