/**
 * Centralized validation schemas using Zod.
 * All form validation should use these schemas.
 */

import { z } from "zod";

// ============================================================================
// COMMON VALIDATORS
// ============================================================================

/** Phone number validation */
export const phoneSchema = z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(
        /^[\d\s\-()+.]+$/,
        "Phone number can only contain digits, spaces, and basic punctuation"
    );

/** Email validation */
export const emailSchema = z
    .string()
    .email("Please enter a valid email address");

/** URL validation (optional) */
export const optionalUrlSchema = z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal(""));

/** NMLS number validation */
export const nmlsSchema = z
    .string()
    .min(1, "NMLS number is required")
    .regex(/^\d+$/, "NMLS must contain only digits");

/** Percentage string (e.g., "6.125%") */
export const percentageStringSchema = z
    .string()
    .regex(/^\d+\.?\d*%?$/, "Must be a valid percentage (e.g., 6.125%)");

// ============================================================================
// CONTACT FORMS
// ============================================================================

/** Broker/Officer contact form */
export const brokerFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    title: z.string().min(2, "Title is required"),
    phone: phoneSchema,
    email: emailSchema,
    nmls: nmlsSchema,
    headshot: z.string().optional(),
    headshotPosition: z.number().min(0).max(100).optional(),
    headshotPositionX: z.number().min(0).max(100).optional(),
});

export type BrokerFormData = z.infer<typeof brokerFormSchema>;

/** Realtor/Agent contact form */
export const realtorFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    title: z.string().min(2, "Title is required"),
    phone: phoneSchema,
    email: emailSchema,
    brokerage: z.string().min(2, "Brokerage name is required"),
    website: optionalUrlSchema,
    headshot: z.string().optional(),
    headshotPosition: z.number().min(0).max(100).optional(),
    headshotPositionX: z.number().min(0).max(100).optional(),
});

export type RealtorFormData = z.infer<typeof realtorFormSchema>;

/** Company info form */
export const companyFormSchema = z.object({
    name: z.string().min(2, "Company name is required"),
    phone1: phoneSchema,
    phone2: z.string().optional(),
    email: emailSchema,
    website: optionalUrlSchema,
    nmls: nmlsSchema,
    logo: z.string().optional(),
});

export type CompanyFormData = z.infer<typeof companyFormSchema>;

// ============================================================================
// AGENT REGISTRATION
// ============================================================================

/** Agent partner registration form */
export const agentRegistrationSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    title: z.string().min(2, "Title is required"),
    phone: phoneSchema,
    email: emailSchema,
    brokerage: z.string().min(2, "Brokerage is required"),
    website: optionalUrlSchema,
    license_number: z.string().optional(),
    headshot_url: optionalUrlSchema,
});

export type AgentRegistrationData = z.infer<typeof agentRegistrationSchema>;

// ============================================================================
// LEAD FORMS
// ============================================================================

/** Lead capture form */
export const leadFormSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: emailSchema,
    phone: phoneSchema,
});

export type LeadFormData = z.infer<typeof leadFormSchema>;

// ============================================================================
// RATES
// ============================================================================

/** Mortgage rates form */
export const ratesFormSchema = z.object({
    thirtyYearFixed: percentageStringSchema,
    thirtyYearFixedAPR: percentageStringSchema,
    fifteenYearFixed: percentageStringSchema,
    fifteenYearFixedAPR: percentageStringSchema,
    thirtyYearJumbo: percentageStringSchema,
    thirtyYearJumboAPR: percentageStringSchema,
    fiveOneArm: percentageStringSchema.optional(),
    fiveOneArmAPR: percentageStringSchema.optional(),
    fha: percentageStringSchema.optional(),
    fhaAPR: percentageStringSchema.optional(),
    va: percentageStringSchema.optional(),
    vaAPR: percentageStringSchema.optional(),
    dateGenerated: z.string(),
});

export type RatesFormData = z.infer<typeof ratesFormSchema>;

// ============================================================================
// MARKET COPY
// ============================================================================

/** Market copy form */
export const marketCopySchema = z.object({
    headline: z.string().min(1, "Headline is required").max(100, "Headline too long"),
    subheading: z.string().max(200, "Subheading too long").optional(),
    marketInsight: z.string().max(500, "Market insight too long").optional(),
});

export type MarketCopyData = z.infer<typeof marketCopySchema>;

/** Region insight */
export const regionSchema = z.object({
    name: z.string().min(1, "Region name is required"),
    cities: z.string().min(1, "Cities are required"),
    insight: z.string().max(300, "Insight too long").optional(),
});

export type RegionData = z.infer<typeof regionSchema>;

// ============================================================================
// CTA
// ============================================================================

/** Call-to-action form */
export const ctaSchema = z.object({
    buttonText: z.string().min(1, "Button text is required").max(50, "Button text too long"),
    buttonUrl: z.string().url("Please enter a valid URL"),
    showQRCode: z.boolean(),
});

export type CTAData = z.infer<typeof ctaSchema>;

// ============================================================================
// TEMPLATE
// ============================================================================

/** Template save form */
export const templateSaveSchema = z.object({
    name: z.string().min(1, "Template name is required").max(100, "Name too long"),
});

export type TemplateSaveData = z.infer<typeof templateSaveSchema>;

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Validate data against a schema and return validation errors
 */
export function validateForm<T>(
    schema: z.ZodSchema<T>,
    data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
    const result = schema.safeParse(data);

    if (result.success) {
        return { success: true, data: result.data };
    }

    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
        const path = issue.path.join(".");
        errors[path] = issue.message;
    }

    return { success: false, errors };
}
