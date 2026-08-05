import type { Conversation } from "@persista/shared";
import type { ExtractedMemory } from "../models";

export interface Extractor {
  extract(conversation: Conversation): Promise<ExtractedMemory[]>;
}