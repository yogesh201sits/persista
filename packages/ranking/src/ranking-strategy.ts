import type { VectorSearchResult } from "@persista/vector-store";

export interface RankingStrategy {
  rank(
    results: VectorSearchResult[],
  ): VectorSearchResult[];
}