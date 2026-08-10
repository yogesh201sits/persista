import type {
  VectorSearchResult,
} from "@persista/vector-store";

import type {
  GraphSearchResult,
} from "@persista/graph";

export interface HybridSearchOptions {
  limit?: number;
  minScore?: number;
  graphDepth?: number;
}

export interface HybridSearchResult {
  query: string;

  vectorResults: VectorSearchResult[];

  graphResult: GraphSearchResult | null;
}