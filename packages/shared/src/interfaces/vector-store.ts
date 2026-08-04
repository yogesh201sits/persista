import type { SearchResult } from "../types";

export interface VectorStore {
  upsert(
    id: string,
    embedding: number[],
    metadata?: Record<string, unknown>,
  ): Promise<void>;

  delete(id: string): Promise<void>;

  search(
    embedding: number[],
    limit: number,
  ): Promise<SearchResult[]>;
}