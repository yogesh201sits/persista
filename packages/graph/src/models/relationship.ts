export interface Relationship {
  id: string;

  sourceId: string;

  targetId: string;

  type: string;

  confidence: number;

  metadata?: Record<string, unknown>;
}
