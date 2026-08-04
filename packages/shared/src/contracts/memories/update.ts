import type { Metadata } from "../common";

export interface UpdateMemoryRequest {
  content?: string;
  metadata?: Metadata;
}

export interface UpdateMemoryResponse {
  updatedAt: string;
}