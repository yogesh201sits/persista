import type {
  Conversation,
  EmbeddingProvider,
} from "@persista/shared";

import type {
  VectorStore,
  VectorMemory,
  VectorSearchOptions,
  VectorSearchResult,
} from "@persista/vector-store";

import type { Extractor } from "@persista/extractor";
import type {
  RetrievalEngine,
} from "@persista/ranking";

import type { MemoryManager } from "./memory-manager";

export class DefaultMemoryManager
  implements MemoryManager
{
  constructor(
    private readonly extractor: Extractor,
    private readonly embeddingProvider: EmbeddingProvider,
    private readonly vectorStore: VectorStore,
    private readonly retrievalEngine: RetrievalEngine,
  ) {}

  async remember(
    conversation: Conversation,
  ): Promise<void> {
    const result =
      await this.extractor.extract(
        conversation,
      );

    if (result.memories.length === 0) {
      return;
    }

    const texts = result.memories.map(
      (memory) => memory.content,
    );

    const embeddings =
      await this.embeddingProvider.embedBatch(
        texts,
      );

    const vectorMemories: VectorMemory[] = [];

    for (
      let i = 0;
      i < result.memories.length;
      i++
    ) {
      const memory = result.memories[i];

      vectorMemories.push({
        id: crypto.randomUUID(),
        embedding: embeddings[i],
        metadata: {
          content: memory.content,
          type: memory.type,
          confidence: memory.confidence,
          createdAt:
            new Date().toISOString(),
          ...(memory.value !== undefined
            ? {
                value: memory.value,
              }
            : {}),

          ...(memory.metadata ?? {}),
        },
      });
    }

    await this.vectorStore.upsertBatch(
      vectorMemories,
    );
  }

  async search(
    query: string,
    options?: VectorSearchOptions,
  ): Promise<VectorSearchResult[]> {
    return this.retrievalEngine.search(
      query,
      options,
    );
  }
}
