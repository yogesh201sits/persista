import type { ExtractionResult } from "../models";

export interface Extractor {
  extract(text: string): Promise<ExtractionResult>;
}