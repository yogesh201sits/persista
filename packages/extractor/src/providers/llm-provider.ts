import type { ExtractedMemory } from "../models";

export interface LLMProvider {
  extractMemories(sentences: string[]): Promise<ExtractedMemory[]>;
}
