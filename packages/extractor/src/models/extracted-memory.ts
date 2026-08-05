export interface ExtractedMemory {
  content: string;

  type:
    | "fact"
    | "identity"
    | "preference"
    | "goal"
    | "relationship";

  confidence: number;

  /**
   * Structured value extracted from the content.
   * Example:
   * "My name is Yogesh" -> "Yogesh"
   */
  value?: string;

  metadata?: Record<string, unknown>;
}