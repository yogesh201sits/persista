import type {
  VectorSearchOptions,
  VectorSearchResult,
} from "@persista/vector-store";

import type { BaseRetrievalEngine } from "./base-retrieval-engine";

export interface RetrievalEngine
  extends BaseRetrievalEngine<VectorSearchOptions, VectorSearchResult[]> {}
