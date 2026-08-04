import type { ExtractedMemory } from "../models";

export interface ExtractorStrategy {
  extract(sentences: string[]): Promise<ExtractedMemory[]>;
}