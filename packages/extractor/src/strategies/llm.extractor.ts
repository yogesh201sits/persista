import type { ExtractedMemory } from "../models";
import type { LLMProvider } from "../providers/llm-provider";
import type { ExtractorStrategy } from "./extractor-strategy";

export class LLMExtractor implements ExtractorStrategy {
  constructor(private readonly llm: LLMProvider) {}

  async extract(sentences: string[]): Promise<ExtractedMemory[]> {
    if (sentences.length === 0) {
      return [];
    }

    return await this.llm.extractMemories(sentences);
  }
}
