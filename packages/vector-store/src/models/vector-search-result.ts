import type { VectorMemoryMetadata } from "./vector-memory";

export interface VectorSearchResult {
  id: string;

  score: number;

  metadata?: VectorMemoryMetadata;
}