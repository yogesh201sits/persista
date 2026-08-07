export interface VectorMemoryMetadata {
  content: string;

  type:
    | "fact"
    | "identity"
    | "preference"
    | "goal"
    | "relationship";

  confidence: number;

  value?: string;

  [key: string]: unknown;
}

export interface VectorMemory {
  id: string;

  namespace: string;

  embedding: number[];

  metadata?: VectorMemoryMetadata;
}