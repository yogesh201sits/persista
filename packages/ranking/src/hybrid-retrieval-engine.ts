import { HybridSearchOptions,HybridSearchResult } from "./models/hybrid";

export interface HybridRetrievalEngine {
  search(
    query: string,
    options?: HybridSearchOptions,
  ): Promise<HybridSearchResult>;
}