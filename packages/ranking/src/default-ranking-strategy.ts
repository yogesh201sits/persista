import type { VectorSearchResult } from "@persista/vector-store";

import type { RankingStrategy } from "./ranking-strategy";

export interface RankingWeights {
  similarity: number;
  confidence: number;
  recency: number;
}

export class DefaultRankingStrategy implements RankingStrategy {
  constructor(
    private readonly weights: RankingWeights = {
      similarity: 0.6,
      confidence: 0.2,
      recency: 0.2,
    },
  ) {}

  rank(results: VectorSearchResult[]): VectorSearchResult[] {
    const now = Date.now();

    return [...results].sort((a, b) => {
      const scoreA = this.calculateScore(a, now);

      const scoreB = this.calculateScore(b, now);

      return scoreB - scoreA;
    });
  }

  private calculateScore(result: VectorSearchResult, now: number): number {
    const similarity = result.score;

    let confidence = 1;

    if (
      result.metadata !== undefined &&
      typeof result.metadata.confidence === "number"
    ) {
      confidence = result.metadata.confidence;
    }

    let recency = 1;

    if (
      result.metadata !== undefined &&
      typeof result.metadata.createdAt === "string"
    ) {
      const createdAt = new Date(result.metadata.createdAt).getTime();

      if (!Number.isNaN(createdAt)) {
        const age = Math.max(0, now - createdAt);

        const day = 1000 * 60 * 60 * 24;

        recency = 1 / (1 + age / day);
      }
    }

    return (
      similarity * this.weights.similarity +
      confidence * this.weights.confidence +
      recency * this.weights.recency
    );
  }
}
