/**
 * Error handler utility for normalizing and logging errors.
 * Converts any error type into a consistent AppError format.
 */

import {
    AppError,
    NetworkError,
    SupabaseError,
    ValidationError,
    isAppError,
} from "./errors";
import { FEATURES } from "./constants";

/**
 * Supabase error shape from the client library
 */
interface SupabaseErrorShape {
    message: string;
    code?: string;
    details?: string;
    hint?: string;
}

/**
 * Check if an object looks like a Supabase error
 */
function isSupabaseErrorShape(error: unknown): error is SupabaseErrorShape {
    return (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as Record<string, unknown>).message === "string"
    );
}

/**
 * Normalizes any error into an AppError instance.
 *
 * @param error - Any error type (Error, string, object, unknown)
 * @returns An AppError instance with normalized properties
 *
 * @example
 * try {
 *   await someOperation();
 * } catch (error) {
 *   const appError = normalizeError(error);
 *   console.log(appError.toUserMessage());
 * }
 */
export function normalizeError(error: unknown): AppError {
    // Already an AppError, return as-is
    if (isAppError(error)) {
        return error;
    }

    // Network or fetch errors
    if (error instanceof TypeError && error.message === "Failed to fetch") {
        return new NetworkError("Network request failed", undefined, 0);
    }

    // DOM Exception (e.g., AbortError for timeouts)
    if (error instanceof DOMException) {
        if (error.name === "AbortError") {
            return new NetworkError("Request timed out", undefined, 408);
        }
        return new AppError(error.message, "DOM_ERROR", undefined, {
            name: error.name,
        });
    }

    // Standard Error objects
    if (error instanceof Error) {
        // Check for Supabase-like error structure
        if (isSupabaseErrorShape(error)) {
            return new SupabaseError(error.message, error.code, {
                details: error.details,
                hint: error.hint,
            });
        }

        // Generic Error
        return new AppError(error.message, "UNKNOWN_ERROR", undefined, {
            name: error.name,
            stack: error.stack,
        });
    }

    // Plain object with message property
    if (isSupabaseErrorShape(error)) {
        return new SupabaseError(error.message, error.code, {
            details: error.details,
            hint: error.hint,
        });
    }

    // String error
    if (typeof error === "string") {
        return new AppError(error, "UNKNOWN_ERROR");
    }

    // Unknown type - create generic error
    return new AppError(
        "An unexpected error occurred",
        "UNKNOWN_ERROR",
        undefined,
        { originalError: String(error) }
    );
}

/**
 * Logs an error to the console (and optionally to an error service).
 *
 * @param error - The error to log
 * @param context - Additional context about where the error occurred
 */
export function logError(
    error: AppError,
    context?: Record<string, unknown>
): void {
    if (FEATURES.ENABLE_DEBUG_LOGS) {
        console.group(`🚨 [${error.code}] ${error.name}`);
        console.error("Message:", error.message);
        if (error.statusCode) {
            console.error("Status:", error.statusCode);
        }
        if (error.context) {
            console.error("Error Context:", error.context);
        }
        if (context) {
            console.error("Additional Context:", context);
        }
        if (error.stack) {
            console.error("Stack:", error.stack);
        }
        console.groupEnd();
    } else {
        // In production, just log the essential info
        console.error(`[${error.code}] ${error.message}`);
    }

    // TODO: Add integration with error tracking service (e.g., Sentry, LogRocket)
    // if (FEATURES.ENABLE_ERROR_TRACKING) {
    //   errorService.captureException(error, { extra: context });
    // }
}

/**
 * Handles an error by normalizing, logging, and returning a user-friendly message.
 *
 * @param error - Any error type
 * @param context - Optional context about where the error occurred
 * @returns The normalized AppError with a user-friendly message
 *
 * @example
 * try {
 *   await saveFlyer(data);
 * } catch (error) {
 *   const appError = handleError(error, { operation: "saveFlyer" });
 *   toast.error(appError.toUserMessage());
 * }
 */
export function handleError(
    error: unknown,
    context?: Record<string, unknown>
): AppError {
    const appError = normalizeError(error);
    logError(appError, context);
    return appError;
}

/**
 * Creates a validation error with field-specific information.
 *
 * @param field - The field that failed validation
 * @param message - The validation message
 * @returns A ValidationError instance
 */
export function createValidationError(
    field: string,
    message: string
): ValidationError {
    return new ValidationError(message, field);
}

/**
 * Wraps an async operation with error handling.
 *
 * @param operation - The async operation to wrap
 * @param context - Context for error logging
 * @returns A tuple of [result, error]
 *
 * @example
 * const [data, error] = await safeAsync(fetchFlyers(), { operation: "fetchFlyers" });
 * if (error) {
 *   toast.error(error.toUserMessage());
 *   return;
 * }
 * // Use data safely
 */
export async function safeAsync<T>(
    operation: Promise<T>,
    context?: Record<string, unknown>
): Promise<[T, null] | [null, AppError]> {
    try {
        const result = await operation;
        return [result, null];
    } catch (error) {
        const appError = handleError(error, context);
        return [null, appError];
    }
}
