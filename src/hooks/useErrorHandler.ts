/**
 * React hook for consistent error handling in components.
 * Provides toast notifications and error tracking integration.
 */

import { useCallback } from "react";
import { toast } from "sonner";
import { handleError, normalizeError, safeAsync } from "@/lib/errorHandler";
import { AppError, isAppError } from "@/lib/errors";

interface UseErrorHandlerOptions {
    /** Custom error handler for additional processing */
    onError?: (error: AppError) => void;
    /** Whether to show toast notifications (default: true) */
    showToast?: boolean;
    /** Default toast title for errors */
    defaultTitle?: string;
}

interface ErrorHandlerResult {
    /**
     * Handle an error with optional context.
     * Logs the error and shows a toast notification.
     */
    handleError: (error: unknown, context?: Record<string, unknown>) => AppError;

    /**
     * Handle an error silently (log only, no toast).
     */
    handleErrorSilent: (error: unknown, context?: Record<string, unknown>) => AppError;

    /**
     * Wrap an async operation with error handling.
     * Returns [result, null] on success, [null, error] on failure.
     */
    withErrorHandling: <T>(
        operation: Promise<T>,
        context?: Record<string, unknown>
    ) => Promise<[T, null] | [null, AppError]>;

    /**
     * Show an error toast with custom message.
     */
    showError: (message: string, description?: string) => void;

    /**
     * Check if an error matches a specific code.
     */
    isErrorCode: (error: unknown, code: string) => boolean;
}

/**
 * React hook for consistent error handling across components.
 *
 * @param options - Configuration options
 * @returns Error handling utilities
 *
 * @example
 * function MyComponent() {
 *   const { handleError, withErrorHandling } = useErrorHandler();
 *
 *   const handleSubmit = async () => {
 *     const [data, error] = await withErrorHandling(
 *       saveFlyer(formData),
 *       { operation: "saveFlyer" }
 *     );
 *     if (error) return;
 *     // Success logic
 *   };
 * }
 */
export function useErrorHandler(
    options: UseErrorHandlerOptions = {}
): ErrorHandlerResult {
    const { onError, showToast = true, defaultTitle = "Error" } = options;

    /**
     * Display an error toast notification
     */
    const showErrorToast = useCallback(
        (error: AppError) => {
            const userMessage = error.toUserMessage();
            toast.error(defaultTitle, {
                description: userMessage,
            });
        },
        [defaultTitle]
    );

    /**
     * Handle an error: log, notify, and optionally call custom handler
     */
    const handleErrorWithToast = useCallback(
        (error: unknown, context?: Record<string, unknown>): AppError => {
            const appError = handleError(error, context);

            if (showToast) {
                showErrorToast(appError);
            }

            if (onError) {
                onError(appError);
            }

            return appError;
        },
        [showToast, showErrorToast, onError]
    );

    /**
     * Handle an error silently (log only, no toast)
     */
    const handleErrorSilent = useCallback(
        (error: unknown, context?: Record<string, unknown>): AppError => {
            const appError = handleError(error, context);

            if (onError) {
                onError(appError);
            }

            return appError;
        },
        [onError]
    );

    /**
     * Wrap an async operation with error handling
     */
    const withErrorHandling = useCallback(
        async <T>(
            operation: Promise<T>,
            context?: Record<string, unknown>
        ): Promise<[T, null] | [null, AppError]> => {
            const [result, error] = await safeAsync(operation, context);

            if (error) {
                if (showToast) {
                    showErrorToast(error);
                }
                if (onError) {
                    onError(error);
                }
            }

            return error ? [null, error] : [result, null];
        },
        [showToast, showErrorToast, onError]
    );

    /**
     * Show a custom error toast
     */
    const showError = useCallback((message: string, description?: string) => {
        toast.error(message, { description });
    }, []);

    /**
     * Check if an error matches a specific code
     */
    const isErrorCode = useCallback((error: unknown, code: string): boolean => {
        if (isAppError(error)) {
            return error.code === code;
        }
        return false;
    }, []);

    return {
        handleError: handleErrorWithToast,
        handleErrorSilent,
        withErrorHandling,
        showError,
        isErrorCode,
    };
}

export default useErrorHandler;
