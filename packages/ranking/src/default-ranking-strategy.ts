import type { VectorSearchResult } from "@persista/vector-store";

import type { RankingStrategy } from "./ranking-strategy";

export class DefaultRankingStrategy
  implements RankingStrategy
{
  rank(
    results: VectorSearchResult[],
  ): VectorSearchResult[] {
    return [...results].sort(
      (a, b) => b.score - a.score,
    );
  }
}