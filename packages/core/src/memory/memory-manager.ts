import type { Conversation } from "@persista/shared";

import type {
  VectorSearchOptions,
  VectorSearchResult,
} from "@persista/vector-store";

import type { MemoryUpdate } from "../models";

export interface MemoryManager {
  remember(conversation: Conversation): Promise<void>;

  search(
    query: string,
    options?: VectorSearchOptions,
  ): Promise<VectorSearchResult[]>;

  delete(id: string): Promise<void>;

  update(memory: MemoryUpdate): Promise<void>;
}