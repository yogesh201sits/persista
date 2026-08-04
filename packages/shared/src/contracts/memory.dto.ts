import type { Metadata } from "./common";

export interface MemoryDto {
  /**
   * Unique identifier of the memory.
   */
  id: string;

  /**
   * Namespace the memory belongs to.
   */
  namespace: string;

  /**
   * Original memory content.
   */
  content: string;

  /**
   * Optional user-defined metadata.
   */
  metadata?: Metadata;

  /**
   * Creation timestamp (ISO 8601).
   */
  createdAt: string;

  /**
   * Last update timestamp (ISO 8601).
   */
  updatedAt: string;
}

export interface ScoredMemoryDto extends MemoryDto {
  /**
   * Similarity score between 0 and 1.
   */
  score: number;
}