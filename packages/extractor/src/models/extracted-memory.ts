export interface ExtractedMemory {
  content: string;

  type:
    | "fact"
    | "preference"
    | "identity"
    | "goal"
    | "relationship";

  confidence: number;

  metadata?: Record<string, unknown>;
}