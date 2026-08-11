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

import type {
  MemoryDeduplicator,
} from "../deduplication/memory-deduplicator";

import { HybridSearchOptions,HybridSearchResult } from "@persista/ranking";

import type { Extractor } from "@persista/extractor";
import type {
  RetrievalEngine,HybridRetrievalEngine
} from "@persista/ranking";

import { MemoryUpdate } from "../models";

import type { MemoryManager } from "./memory-manager";

export class DefaultMemoryManager
  implements MemoryManager
{
  constructor(
    private readonly extractor: Extractor,
    private readonly embeddingProvider: EmbeddingProvider,
    private readonly vectorStore: VectorStore,
    private readonly retrievalEngine: HybridRetrievalEngine,
    private readonly deduplicator: MemoryDeduplicator,
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

    const texts =
      result.memories.map(
        (memory) => memory.content,
      );

    const embeddings =
      await this.embeddingProvider.embedBatch(
        texts,
      );

    const duplicateResults =
      await Promise.all(
        embeddings.map(
          (embedding) =>
            this.vectorStore.search(
              embedding,
              {
                limit: 1,
                minScore: 0.95,
              },
            ),
        ),
      );

    const vectorMemories:
      VectorMemory[] = [];

    for (
      let i = 0;
      i < result.memories.length;
      i++
    ) {
      const memory =
        result.memories[i];

      const embedding =
        embeddings[i];

      const duplicates =
        duplicateResults[i];

      if (
        this.deduplicator.isDuplicate(
          duplicates,
        )
      ) {
        continue;
      }

      vectorMemories.push({
        id: crypto.randomUUID(),

        embedding,

        metadata: {
          content: memory.content,
          type: memory.type,
          confidence:
            memory.confidence,

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

    if (vectorMemories.length === 0) {
      return;
    }

    await this.vectorStore.upsertBatch(
      vectorMemories,
    );
  }

  async search(
      query: string,
      options?: HybridSearchOptions,
    ): Promise<HybridSearchResult> {
      return this.retrievalEngine.search(
        query,
        options,
      );
  }

  async delete(
    id: string,
  ): Promise<void> {
    await this.vectorStore.delete(id);
  }

  async update(
    memory: MemoryUpdate,
  ): Promise<void> {
    const embedding =
      await this.embeddingProvider.embed(
        memory.content,
      );

    await this.vectorStore.upsert({
      id: memory.id,

      embedding,

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
      },
    });
  }
}
