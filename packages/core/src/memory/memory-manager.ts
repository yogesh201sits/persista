import type { Conversation } from "@persista/shared";

import type {
  HybridSearchOptions,
  HybridSearchResult,
} from "@persista/ranking";

import { MemoryUpdate } from "../models";

export interface MemoryManager {
  remember(conversation: Conversation): Promise<void>;

  search(
    query: string,
    options?: HybridSearchOptions,
  ): Promise<HybridSearchResult>;

  delete(id: string): Promise<void>;

  update(memory: MemoryUpdate): Promise<void>;
}
