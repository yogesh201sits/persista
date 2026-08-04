import type { Pagination } from "../common";

export interface SearchRequest extends Pagination {
  namespace: string;
  query: string;
}

export interface SearchMemory {
  id: string;
  content: string;
  score: number;
}

export interface SearchResponse {
  memories: SearchMemory[];
}
