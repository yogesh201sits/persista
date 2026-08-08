import type {
  VectorSearchResult,
} from "@persista/vector-store";

import type {
  RankingStrategy,
} from "./ranking-strategy";

export class DefaultRankingStrategy
  implements RankingStrategy
{
  rank(
    results: VectorSearchResult[],
  ): VectorSearchResult[] {
    return [...results].sort(
      (a, b) => {
        let confidenceA = 1;
        let confidenceB = 1;

        if (
          a.metadata !== undefined &&
          typeof a.metadata.confidence === "number"
        ) {
          confidenceA =
            a.metadata.confidence;
        }

        if (
          b.metadata !== undefined &&
          typeof b.metadata.confidence === "number"
        ) {
          confidenceB =
            b.metadata.confidence;
        }

        const scoreA =
          a.score * confidenceA;

        const scoreB =
          b.score * confidenceB;

        return scoreB - scoreA;
      },
    );
  }
}