export interface Pagination {
  limit?: number;
  cursor?: string;
}

export interface PageInfo {
  nextCursor?: string;
  hasMore: boolean;
}