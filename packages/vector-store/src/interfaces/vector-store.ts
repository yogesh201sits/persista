import type {
  VectorMemory,
  VectorSearchOptions,
  VectorSearchResult,
} from "../models";

export interface VectorStore {
  upsert(
    memory: VectorMemory,
  ): Promise<void>;

  upsertBatch(
    memories: VectorMemory[],
  ): Promise<void>;

  search(
    embedding: number[],
    options?: VectorSearchOptions,
  ): Promise<VectorSearchResult[]>;

  delete(id: string): Promise<void>;

  clear(namespace: string): Promise<void>;
}