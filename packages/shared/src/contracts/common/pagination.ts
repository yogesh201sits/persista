/**
 * Cursor-based pagination request.
 */
export interface PaginationRequest {
  /**
   * Maximum number of items to return.
   */
  limit?: number;

  /**
   * Cursor for fetching the next page.
   */
  cursor?: string;
}

/**
 * Pagination metadata returned by paginated endpoints.
 */
export interface PaginationInfo {
  /**
   * Cursor for the next page, if available.
   */
  nextCursor?: string;

  /**
   * Indicates whether more results are available.
   */
  hasMore: boolean;
}