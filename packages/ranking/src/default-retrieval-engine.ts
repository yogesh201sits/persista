import type {
  EmbeddingProvider,
} from "@persista/shared";

import type {
  VectorSearchOptions,
  VectorSearchResult,
  VectorStore,
} from "@persista/vector-store";

import type {
  RetrievalEngine,
} from "./retrieval-engine";

export class DefaultRetrievalEngine
  implements RetrievalEngine
{
  constructor(
    private readonly embeddingProvider: EmbeddingProvider,
    private readonly vectorStore: VectorStore,
  ) {}

  async search(
    query: string,
    options?: VectorSearchOptions,
  ): Promise<VectorSearchResult[]> {
    const embedding =
      await this.embeddingProvider.embed(query);

    return this.vectorStore.search(
      embedding,
      options,
    );
  }
}