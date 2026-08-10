import type {
  GraphRetrievalEngine,
} from "@persista/graph";

import type {
  VectorSearchResult,
} from "@persista/vector-store";

import type {
  HybridRetrievalEngine,
} from "./hybrid-retrieval-engine";

import type {
  HybridSearchOptions,
  HybridSearchResult,
} from "./models";

export class DefaultHybridRetrievalEngine
  implements HybridRetrievalEngine
{
  constructor(
    private readonly vectorRetrievalEngine: {
      search(
        query: string,
        options?: {
          limit?: number;
          minScore?: number;
        },
      ): Promise<VectorSearchResult[]>;
    },

    private readonly graphRetrievalEngine:
      GraphRetrievalEngine,
  ) {}

  async search(
    query: string,
    options?: HybridSearchOptions,
  ): Promise<HybridSearchResult> {
    const [
      vectorResults,
      graphResult,
    ] = await Promise.all([
      this.vectorRetrievalEngine.search(
        query,
        {
          limit: options?.limit,
          minScore: options?.minScore,
        },
      ),

      this.graphRetrievalEngine.search(
        query,
        options?.graphDepth ?? 1,
      ),
    ]);

    const results = [];

    for (const result of vectorResults) {
      results.push({
        id: result.id,
        score: result.score,
        sources: ["vector" as const],
        memory: result,
      });
    }

    if (graphResult) {
      results.push({
        id: graphResult.entity.id,
        score: 0,
        sources: ["graph" as const],
        entity: graphResult.entity,
        relationships:
          graphResult.relationships,
      });
    }

    return {
      query,
      results,
    };
  }
}