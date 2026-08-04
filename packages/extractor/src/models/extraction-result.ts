import type { ExtractedMemory } from "./extracted-memory";

export interface ExtractionResult {
  memories: ExtractedMemory[];

  processingTime: number;
}