import type { EmbeddingProvider } from "@persista/shared";

import type {
  VectorSearchOptions,
  VectorSearchResult,
  VectorStore,
} from "@persista/vector-store";

import type { RankingStrategy } from "./ranking-strategy";
import type { RetrievalEngine } from "./retrieval-engine";

export class DefaultRetrievalEngine
  implements RetrievalEngine
{
  constructor(
    private readonly embeddingProvider: EmbeddingProvider,
    private readonly vectorStore: VectorStore,
    private readonly rankingStrategy: RankingStrategy,
  ) {}

  async search(
    query: string,
    options?: VectorSearchOptions,
  ): Promise<VectorSearchResult[]> {
    const embedding =
      await this.embeddingProvider.embed(query);

    const results =
      await this.vectorStore.search(
        embedding,
        options,
      );

    let filteredResults = results;

    if (options?.minScore !== undefined) {
      filteredResults = results.filter(
        (result) =>
          result.score >= options.minScore!,
      );
    }

    return this.rankingStrategy.rank(
      filteredResults,
    );
  }
}
