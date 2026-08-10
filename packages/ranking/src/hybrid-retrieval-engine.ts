import type { BaseRetrievalEngine } from "./base-retrieval-engine";

import type {
  HybridSearchOptions,
  HybridSearchResult,
} from "./models";

export interface HybridRetrievalEngine
  extends BaseRetrievalEngine<
    HybridSearchOptions,
    HybridSearchResult
  > {}