import type { Conversation } from "@persista/shared";
import type {
  VectorSearchOptions,
  VectorSearchResult,
} from "@persista/vector-store";

export interface MemoryManager {
  remember(
    conversation: Conversation,
  ): Promise<void>;
   search(
    query: string,
    options?: VectorSearchOptions,
  ): Promise<VectorSearchResult[]>;
}