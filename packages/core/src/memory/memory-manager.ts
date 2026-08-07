import type { Conversation } from "@persista/shared";
import type {
  VectorSearchOptions,
  VectorSearchResult,
} from "@persista/vector-store";

export interface MemoryManager {
  remember(
    namespace: string,
    conversation: Conversation,
  ): Promise<void>;
   search(
    namespace: string,
    query: string,
    options?: VectorSearchOptions,
  ): Promise<VectorSearchResult[]>;
}