import type {
  HybridSearchOptions,
  HybridSearchResult,
} from "./models";

export interface HybridRetrievalEngine {
  search(
    query: string,
    options?: HybridSearchOptions,
  ): Promise<HybridSearchResult>;
}