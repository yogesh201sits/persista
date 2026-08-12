import type { EmbeddingProvider } from "@persista/shared";

import type {
  VectorSearchOptions,
  VectorSearchResult,
  VectorStore,
} from "@persista/vector-store";

import type { RankingStrategy } from "./ranking-strategy";
import type { RetrievalEngine } from "./retrieval-engine";

export class DefaultRetrievalEngine implements RetrievalEngine {
  constructor(
    private readonly embeddingProvider: EmbeddingProvider,
    private readonly vectorStore: VectorStore,
    private readonly rankingStrategy: RankingStrategy,
  ) {}

  async search(
    query: string,
    options?: VectorSearchOptions,
  ): Promise<VectorSearchResult[]> {
    const embedding = await this.embeddingProvider.embed(query);

    const limit = options?.limit ?? 10;

    const candidateLimit = Math.max(limit * 5, 20);

    const results = await this.vectorStore.search(embedding, {
      ...options,
      limit: candidateLimit,
    });

    // Default minimum relevance threshold.
    // Can be overridden through search options.
    const minScore = options?.minScore ?? 0.3;

    const filteredResults = results.filter(
      (result) => result.score >= minScore,
    );

    const rankedResults = this.rankingStrategy.rank(
      filteredResults,
    );

    return rankedResults.slice(0, limit);
  }
}
