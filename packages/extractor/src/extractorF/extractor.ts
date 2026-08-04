import { TextCleaner,TextNormalizer,SentenceSplitter} from "../preprocessors";
import { ExtractorStrategy } from "../strategies";
import type {Conversation,Extractor as IExtractor,Memory,} from "@persista/shared";

export class Extractor implements IExtractor {
  constructor(
    private readonly cleaner: TextCleaner,
    private readonly normalizer: TextNormalizer,
    private readonly splitter: SentenceSplitter,
    private readonly strategy: ExtractorStrategy,
  ) {}

  async extract(conversation: Conversation): Promise<Memory[]> {
    // implementation
  }
}