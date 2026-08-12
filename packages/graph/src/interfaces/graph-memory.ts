import type { Conversation } from "@persista/shared";

export interface GraphMemory {
  remember(conversation: Conversation): Promise<void>;
}
