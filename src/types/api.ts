/**
 * API Response Types
 * Centralized type definitions for Supabase and API responses.
 */

import type { FlyerData } from "./flyer";

// ============================================================================
// Generic API Response Types
// ============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
    data: T | null;
    error: ApiError | null;
    success: boolean;
}

/**
 * Standard API error format
 */
export interface ApiError {
    message: string;
    code?: string;
    details?: unknown;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

// ============================================================================
// Flyer API Types
// ============================================================================

/**
 * Flyer template as returned from Supabase
 */
export interface FlyerTemplateRow {
    id: string;
    name: string;
    slug: string | null;
    data: unknown; // JSON column - needs cast to FlyerData
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

/**
 * Typed flyer template with parsed data
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
 * Create flyer request payload
 */
export interface CreateFlyerRequest {
    name: string;
    data: FlyerData;
    slug?: string;
}

/**
 * Update flyer request payload
 */
export interface UpdateFlyerRequest {
    name?: string;
    data?: FlyerData;
    slug?: string;
    is_published?: boolean;
}

// ============================================================================
// Analytics API Types
// ============================================================================

/**
 * Flyer analytics record
 */
export interface FlyerAnalytics {
    id: string;
    flyer_slug: string;
    viewed_at: string;
    referrer: string | null;
    user_agent: string | null;
}

/**
 * Analytics summary for a flyer
 */
export interface FlyerAnalyticsSummary {
    totalViews: number;
    uniqueReferrers: number;
    viewsByDay: Record<string, number>;
    topReferrers: Array<{ referrer: string; count: number }>;
}

// ============================================================================
// Agent API Types
// ============================================================================

/**
 * Agent partner record
 */
export interface AgentPartner {
    id: string;
    name: string;
    email: string;
    phone: string;
    brokerage: string;
    regions: string[];
    active: boolean;
}

/**
 * Agent lookup result
 */
export interface AgentLookupResult {
    found: boolean;
    agent: AgentPartner | null;
}

// ============================================================================
// Rate API Types
// ============================================================================

/**
 * Mortgage rate response from edge function
 */
export interface MortgageRateResponse {
    thirtyYearFixed: number;
    thirtyYearFixedAPR: number;
    fifteenYearFixed: number;
    fifteenYearFixedAPR: number;
    thirtyYearJumbo: number;
    thirtyYearJumboAPR: number;
    fiveOneArm: number;
    fiveOneArmAPR: number;
    fha: number;
    fhaAPR: number;
    va: number;
    vaAPR: number;
    dateGenerated: string;
    source: string;
}
