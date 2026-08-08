import type {
  VectorSearchOptions,
  VectorSearchResult,
} from "@persista/vector-store";

export interface RetrievalEngine {
  search(
    query: string,
    options?: VectorSearchOptions,
  ): Promise<VectorSearchResult[]>;
}