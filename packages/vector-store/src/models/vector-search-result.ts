import type { VectorMemoryMetadata } from "./vector-memory";

export interface VectorSearchResult {
  id: string;

  namespace?: string;

  score: number;

  metadata?: VectorMemoryMetadata;
}
