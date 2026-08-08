import type { Conversation } from "@persista/shared";

import type { ExtractionResult } from "../models";
import {
  SentenceSplitter,
  TextCleaner,
  TextNormalizer,
} from "../preprocessors";
import type { ExtractorStrategy } from "../strategies";

export class Extractor {
  constructor(
    private readonly cleaner: TextCleaner,
    private readonly normalizer: TextNormalizer,
    private readonly splitter: SentenceSplitter,
    private readonly strategy: ExtractorStrategy,
  ) {}

  async extract(conversation: Conversation): Promise<ExtractionResult> {
    const start = performance.now();

    const text = conversation.messages
      .map((message) => message.content)
      .join("\n");

    const cleaned = this.cleaner.clean(text);

    const normalized = this.normalizer.normalize(cleaned);

    const sentences = this.splitter.split(normalized);

    // IMPORTANT: await here
    const memories = await this.strategy.extract(sentences);

    return {
      memories,
      processingTime: performance.now() - start,
    };
  }
}
