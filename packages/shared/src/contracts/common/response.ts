import type { PaginationInfo } from "./pagination";

/**
 * Metadata returned with every successful response.
 */
export interface ResponseMeta {
  /**
   * Request identifier for tracing.
   */
  requestId?: string;

  /**
   * Response generation timestamp.
   */
  timestamp: string;

  /**
   * Pagination information for list endpoints.
   */
  pagination?: PaginationInfo;
}

/**
 * Standard API success response.
 */
export interface ApiResponse<T> {
  success: true;
  data: T;
  meta: ResponseMeta;
}
