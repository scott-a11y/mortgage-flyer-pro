/**
 * Formatting utilities for consistent display of values.
 */

// ============================================================================
// CURRENCY FORMATTING
// ============================================================================

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
});

const currencyFormatterWithCents = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

/**
 * Format a number as currency (no cents)
 * @example formatCurrency(450000) => "$450,000"
 */
export function formatCurrency(value: number): string {
    return currencyFormatter.format(value);
}

/**
 * Format a number as currency with cents
 * @example formatCurrencyWithCents(450000.50) => "$450,000.50"
 */
export function formatCurrencyWithCents(value: number): string {
    return currencyFormatterWithCents.format(value);
}

/**
 * Format a number as compact currency
 * @example formatCurrencyCompact(1500000) => "$1.5M"
 */
export function formatCurrencyCompact(value: number): string {
    if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
        return `$${(value / 1000).toFixed(0)}K`;
    }
    return formatCurrency(value);
}

// ============================================================================
// PERCENTAGE FORMATTING
// ============================================================================

/**
 * Format a number as a percentage string
 * @example formatPercentage(6.125) => "6.125%"
 */
export function formatPercentage(value: number, decimals = 3): string {
    return `${value.toFixed(decimals)}%`;
}

/**
 * Parse a percentage string to a number
 * @example parsePercentage("6.125%") => 6.125
 */
export function parsePercentage(value: string): number {
    return parseFloat(value.replace("%", "").trim()) || 0;
}

/**
 * Strip the % sign from a rate string
 * @example stripPercent("6.125%") => "6.125"
 */
export function stripPercent(value: string): string {
    return value.replace("%", "").trim();
}

// ============================================================================
// PHONE FORMATTING
// ============================================================================

/**
 * Format a phone number for display
 * @example formatPhone("3606061106") => "(360) 606-1106"
 */
export function formatPhone(phone: string): string {
    const digits = phone.replace(/\D/g, "");

    if (digits.length === 10) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    if (digits.length === 11 && digits[0] === "1") {
        return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }

    // Return original if can't format
    return phone;
}

// ============================================================================
// DATE FORMATTING
// ============================================================================

/**
 * Format a date for display
 * @example formatDate(new Date()) => "January 23, 2026"
 */
export function formatDate(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

/**
 * Format a date with time
 * @example formatDateTime(new Date()) => "January 23, 2026, 5:00 PM"
 */
export function formatDateTime(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

/**
 * Format a date as relative time
 * @example formatRelativeTime(new Date()) => "just now"
 */
export function formatRelativeTime(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return formatDate(d);
}

// ============================================================================
// NAME FORMATTING
// ============================================================================

/**
 * Get initials from a name
 * @example getInitials("Scott Little") => "SL"
 */
export function getInitials(name: string): string {
    return name
        .split(" ")
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

/**
 * Get first name from full name
 * @example getFirstName("Scott Little") => "Scott"
 */
export function getFirstName(name: string): string {
    return name.split(" ")[0] || name;
}

// ============================================================================
// URL FORMATTING
// ============================================================================

/**
 * Strip protocol from URL for display
 * @example stripProtocol("https://www.example.com") => "www.example.com"
 */
export function stripProtocol(url: string): string {
    return url.replace(/^https?:\/\//, "");
}

/**
 * Ensure URL has protocol
 * @example ensureProtocol("example.com") => "https://example.com"
 */
export function ensureProtocol(url: string): string {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }
    return `https://${url}`;
}
