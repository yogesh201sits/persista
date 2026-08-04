import type { Metadata } from "../common";

export interface RememberRequest {
  namespace: string;
  content: string;
  metadata?: Metadata;
}

export interface RememberResponse {
  id: string;
  createdAt: string;
}