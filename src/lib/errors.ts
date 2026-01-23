/**
 * Custom application error classes for consistent error handling.
 * Use these classes to categorize errors and provide structured error information.
 */

/**
 * Base application error class.
 * All custom errors should extend this class.
 */
export class AppError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly statusCode?: number,
        public readonly context?: Record<string, unknown>
    ) {
        super(message);
        this.name = "AppError";
        // Maintains proper stack trace for where our error was thrown (only in V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    /**
     * Creates a user-friendly error message suitable for display
     */
    toUserMessage(): string {
        return this.message;
    }

    /**
     * Serializes the error for logging or API responses
     */
    toJSON(): Record<string, unknown> {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            statusCode: this.statusCode,
            context: this.context,
        };
    }
}

/**
 * Validation errors for form inputs, data parsing, etc.
 */
export class ValidationError extends AppError {
    constructor(
        message: string,
        public readonly field?: string,
        context?: Record<string, unknown>
    ) {
        super(message, "VALIDATION_ERROR", 400, context);
        this.name = "ValidationError";
    }

    override toUserMessage(): string {
        return this.field
            ? `Invalid ${this.field}: ${this.message}`
            : `Validation error: ${this.message}`;
    }
}

/**
 * Network/API errors including fetch failures, timeouts, etc.
 */
export class NetworkError extends AppError {
    constructor(
        message: string,
        public readonly url?: string,
        statusCode?: number,
        context?: Record<string, unknown>
    ) {
        super(message, "NETWORK_ERROR", statusCode || 0, context);
        this.name = "NetworkError";
    }

    override toUserMessage(): string {
        if (this.statusCode === 0 || !navigator.onLine) {
            return "Unable to connect. Please check your internet connection.";
        }
        if (this.statusCode === 404) {
            return "The requested resource was not found.";
        }
        if (this.statusCode === 429) {
            return "Too many requests. Please wait a moment and try again.";
        }
        if (this.statusCode && this.statusCode >= 500) {
            return "Server error. Please try again later.";
        }
        return this.message;
    }
}

/**
 * Supabase-specific errors for database operations and edge functions.
 */
export class SupabaseError extends AppError {
    constructor(
        message: string,
        public readonly supabaseCode?: string,
        context?: Record<string, unknown>
    ) {
        super(message, `SUPABASE_${supabaseCode || "ERROR"}`, 500, context);
        this.name = "SupabaseError";
    }

    override toUserMessage(): string {
        // Map specific Supabase error codes to user-friendly messages
        switch (this.supabaseCode) {
            case "PGRST116": // No rows returned
                return "The requested item was not found.";
            case "23505": // Unique violation
                return "This item already exists.";
            case "23503": // Foreign key violation
                return "Unable to complete this action due to related data.";
            case "42501": // Insufficient privilege
                return "You don't have permission to perform this action.";
            default:
                return "A database error occurred. Please try again.";
        }
    }
}

/**
 * Authentication/authorization errors.
 */
export class AuthError extends AppError {
    constructor(message: string, context?: Record<string, unknown>) {
        super(message, "AUTH_ERROR", 401, context);
        this.name = "AuthError";
    }

    override toUserMessage(): string {
        return "Authentication required. Please sign in to continue.";
    }
}

/**
 * File operation errors (upload, download, processing).
 */
export class FileError extends AppError {
    constructor(
        message: string,
        public readonly fileName?: string,
        context?: Record<string, unknown>
    ) {
        super(message, "FILE_ERROR", 400, context);
        this.name = "FileError";
    }

    override toUserMessage(): string {
        if (this.message.includes("size")) {
            return "File is too large. Please choose a smaller file.";
        }
        if (this.message.includes("type")) {
            return "Unsupported file type. Please use a supported format.";
        }
        return "File operation failed. Please try again.";
    }
}

/**
 * Type guard to check if an error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
    return error instanceof AppError;
}

/**
 * Error codes for quick reference and i18n
 */
export const ErrorCodes = {
    VALIDATION_ERROR: "VALIDATION_ERROR",
    NETWORK_ERROR: "NETWORK_ERROR",
    SUPABASE_ERROR: "SUPABASE_ERROR",
    AUTH_ERROR: "AUTH_ERROR",
    FILE_ERROR: "FILE_ERROR",
    UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
