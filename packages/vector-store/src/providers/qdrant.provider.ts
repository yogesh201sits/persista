import type {
  VectorMemory,
  VectorSearchOptions,
  VectorSearchResult,
} from "../models";

import type { VectorStore } from "../interfaces";

import { QdrantClient } from "../client";

export interface QdrantVectorStoreOptions {
  url: string;
  apiKey?: string;
  collection: string;
  dimensions: number;
}

export class QdrantVectorStore implements VectorStore {
  private readonly client: QdrantClient;

  constructor(
    private readonly options: QdrantVectorStoreOptions,
  ) {
    this.client = new QdrantClient({
      url: options.url,
      apiKey: options.apiKey,
      collection: options.collection,
      dimensions: options.dimensions,
    });
  }

  async upsert(
    memory: VectorMemory,
  ): Promise<void> {
    await this.client.upsert(
      memory.id,
      memory.embedding,
      {
        namespace: memory.namespace,
        ...memory.metadata,
      },
    );
  }

  async upsertBatch(
    memories: VectorMemory[],
  ): Promise<void> {
    if (memories.length === 0) {
      return;
    }

    await this.client.upsertBatch(
      memories.map((memory) => ({
        id: memory.id,
        vector: memory.embedding,
        payload: {
          namespace: memory.namespace,
          ...memory.metadata,
        },
      })),
    );
  }

  async search(
    embedding: number[],
    options?: VectorSearchOptions,
  ): Promise<VectorSearchResult[]> {
    if (embedding.length === 0) {
      return [];
    }

    const result = await this.client.search(
      embedding,
      options?.limit ?? 10,
    );

    return result.points.map((point) => ({
      id: String(point.id),
      score: point.score,
      metadata:
        (point.payload as Record<string, unknown>) ?? {},
    }));
  }

  async delete(id: string): Promise<void> {
    await this.client.delete(id);
  }

  async clear(): Promise<void> {
    await this.client.clear();
  }
}