export interface VectorMemory {
  id: string;

  namespace: string;

  embedding: number[];

  metadata?: Record<string, unknown>;
}