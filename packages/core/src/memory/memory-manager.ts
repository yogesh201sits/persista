import type { Conversation } from "@persista/shared";

export interface MemoryManager {
  remember(
    namespace: string,
    conversation: Conversation,
  ): Promise<void>;
}