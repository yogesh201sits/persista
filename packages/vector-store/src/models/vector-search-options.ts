export interface VectorSearchOptions {
  limit?: number;

  minScore?: number;

  filter?: Record<string, unknown>;
}
