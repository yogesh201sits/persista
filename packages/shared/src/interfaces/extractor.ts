import type {
  Conversation,
  Memory,
} from "../types";

export interface Extractor {
  extract(
    conversation: Conversation,
  ): Promise<Memory[]>;
}