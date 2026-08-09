import type {
  VectorMemoryMetadata,
} from "@persista/vector-store";

export interface MemoryUpdate {
  id: string;
  content: string;
  type: VectorMemoryMetadata["type"];
  confidence: number;
  value?: string;
}