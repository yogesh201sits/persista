import {
  SentenceSplitter,
  TextCleaner,
  TextNormalizer,
} from "../preprocessors";
import { Extractor } from "../extractorF";
import { LLMExtractor, RuleBasedExtractor } from "../strategies";
import type { LLMProvider } from "../providers";

export type ExtractorType = "rule-based" | "llm";

export interface ExtractorFactoryOptions {
  type: ExtractorType;
  llmProvider?: LLMProvider;
}

export class ExtractorFactory {
  static create(
    options: ExtractorFactoryOptions,
  ): Extractor {
    const strategy =
      ExtractorFactory.createStrategy(options);

    return new Extractor(
      new TextCleaner(),
      new TextNormalizer(),
      new SentenceSplitter(),
      strategy,
    );
  }

  private static createStrategy(
    options: ExtractorFactoryOptions,
  ) {
    switch (options.type) {
      case "rule-based":
        return new RuleBasedExtractor();

      case "llm":
        if (!options.llmProvider) {
          throw new Error(
            "LLM provider is required for LLM extractor",
          );
        }

        return new LLMExtractor(
          options.llmProvider,
        );
    }
  }
}