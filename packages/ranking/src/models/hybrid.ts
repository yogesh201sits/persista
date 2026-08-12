import type { VectorSearchResult } from "@persista/vector-store";

import type { GraphSearchResult } from "@persista/graph";

import { VectorSearchOptions } from "@persista/vector-store";

export interface HybridSearchOptions extends VectorSearchOptions {
  limit?: number;
  minScore?: number;
  graphDepth?: number;

  vectorWeight?: number;
  graphWeight?: number;
}

export interface HybridSearchItem {
  id: string;

  score: number;

  sources: Array<"vector" | "graph">;

  memory?: VectorSearchResult;

  entity?: GraphSearchResult["entity"];

  relationships?: GraphSearchResult["relationships"];
}

export interface HybridSearchResult {
  query: string;

  results: HybridSearchItem[];
}