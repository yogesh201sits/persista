export interface RecallRequest {
  namespace: string;
  query: string;
  limit?: number;
}

export interface RecallMemory {
  id: string;
  content: string;
  score: number;
  metadata?: Record<string, unknown>;
}

export interface RecallResponse {
  memories: RecallMemory[];
}
