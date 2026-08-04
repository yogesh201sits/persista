/**
 * Standard API error payload.
 */
export interface ApiError {
  /**
   * Machine-readable error code.
   */
  code: string;

  /**
   * Human-readable error message.
   */
  message: string;

  /**
   * Optional additional error details.
   */
  details?: unknown;
}

/**
 * Standard API error response.
 */
export interface ApiErrorResponse {
  success: false;
  error: ApiError;
}