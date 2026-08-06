export interface VectorSearchResult {
  id: string;

  score: number;

  metadata?: Record<string, unknown>;
}