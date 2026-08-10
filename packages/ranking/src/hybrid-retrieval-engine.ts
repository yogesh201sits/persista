import type {
  HybridSearchOptions,
  HybridSearchResult,
} from "./models";

import {
  calculateHybridScore,
  calculateMatchRelevance,
  findGraphMatches,
} from "./scoring";

export interface HybridRetrievalEngine {
  search(
    query: string,
    options?: HybridSearchOptions,
  ): Promise<HybridSearchResult>;
}