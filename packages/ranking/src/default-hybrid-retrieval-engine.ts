import type { GraphRetrievalEngine } from "@persista/graph";
import type { VectorSearchResult } from "@persista/vector-store";

import type { HybridRetrievalEngine } from "./hybrid-retrieval-engine";
import type {
  HybridSearchItem,
  HybridSearchOptions,
  HybridSearchResult,
} from "./models";

import { calculateRRFScore } from "./scoring";
import { QueryAnalyzer } from "./llm";

import type {
  QueryAnalyzerInterface,
} from "./llm";

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

    private readonly graphRetrievalEngine: GraphRetrievalEngine,

    private readonly queryAnalyzer: QueryAnalyzerInterface,
  ) {}

  async search(
    query: string,
    options?: HybridSearchOptions,
  ): Promise<HybridSearchResult> {
    const limit =
      options?.limit ?? 10;

    const graphDepth =
      options?.graphDepth ?? 1;

    /*
     * --------------------------------
     * QUERY ANALYSIS
     * --------------------------------
     */

    const analysis =
      await this.queryAnalyzer.analyze(
        query,
      );

    /*
     * --------------------------------
     * VECTOR + GRAPH RETRIEVAL
     * --------------------------------
     */

    const vectorPromise =
      this.vectorRetrievalEngine.search(
        query,
        {
          limit,
          minScore:
            options?.minScore,
        },
      );

    /*
     * Graph search uses entities
     * extracted by the LLM.
     *
     * For now we use the first entity.
     */

    const graphPromise =
      analysis.entities.length > 0
        ? this.graphRetrievalEngine.search(
            analysis.entities[0],
            graphDepth,
          )
        : Promise.resolve(null);

    const [
      vectorResults,
      graphResult,
    ] = await Promise.all([
      vectorPromise,
      graphPromise,
    ]);

    /*
     * --------------------------------
     * VECTOR RANKING
     * --------------------------------
     */

    const vectorRanks =
      new Map<string, number>();

    for (
      let index = 0;
      index < vectorResults.length;
      index++
    ) {
      const result =
        vectorResults[index];

      vectorRanks.set(
        result.id,
        index + 1,
      );
    }

    /*
     * --------------------------------
     * GRAPH RANKING
     * --------------------------------
     */

    const graphItems =
      graphResult
        ? this.getGraphItems(
            graphResult,
          )
        : [];

    const graphRanks =
      new Map<string, number>();

    for (
      let index = 0;
      index < graphItems.length;
      index++
    ) {
      const item =
        graphItems[index];

      graphRanks.set(
        item.id,
        index + 1,
      );
    }

    /*
     * --------------------------------
     * MERGE CANDIDATES
     * --------------------------------
     */

    const candidateIds =
      new Set<string>();

    for (const result of vectorResults) {
      candidateIds.add(result.id);
    }

    for (const item of graphItems) {
      candidateIds.add(item.id);
    }

    /*
     * --------------------------------
     * RRF RANKING
     * --------------------------------
     */

    const results: HybridSearchItem[] =
      [];

    for (const id of candidateIds) {
      const vectorRank =
        vectorRanks.get(id);

      const graphRank =
        graphRanks.get(id);

      const ranks: {
        id: string;
        rank: number;
      }[] = [];

      if (
        vectorRank !== undefined
      ) {
        ranks.push({
          id,
          rank: vectorRank,
        });
      }

      if (
        graphRank !== undefined
      ) {
        ranks.push({
          id,
          rank: graphRank,
        });
      }

      const score =
        calculateRRFScore(
          ranks,
          {
            k: 60,
          },
        );

      const vectorResult =
        vectorResults.find(
          (item) =>
            item.id === id,
        );

      const graphItem =
        graphItems.find(
          (item) =>
            item.id === id,
        );

      results.push({
        id,
        score,

        sources: [
          ...(vectorRank !== undefined
            ? ["vector" as const]
            : []),

          ...(graphRank !== undefined
            ? ["graph" as const]
            : []),
        ],

        ...(vectorResult
          ? {
              memory:
                vectorResult,
            }
          : {}),

        ...(graphItem
          ? {
              entity:
                graphItem.entity,

              relationships:
                graphResult?.relationships,
            }
          : {}),
      });
    }

    /*
     * --------------------------------
     * FINAL SORT
     * --------------------------------
     */

    results.sort(
      (a, b) =>
        b.score - a.score,
    );

    return {
      query,
      results:
        results.slice(0, limit),
    };
  }

  private getGraphItems(
    graphResult: NonNullable<
      Awaited<
        ReturnType<
          GraphRetrievalEngine["search"]
        >
      >
    >,
  ) {
    const items: {
      id: string;
      entity: typeof graphResult.entity;
      depth: number;
      confidence: number;
    }[] = [
      {
        id:
          graphResult.entity.id,

        entity:
          graphResult.entity,

        depth: 0,

        confidence: 1,
      },
    ];

    for (
      const relationship
      of graphResult.relationships
    ) {
      items.push({
        id:
          relationship.entity.id,

        entity:
          relationship.entity,

        depth:
          relationship.depth,

        confidence:
          relationship.relationship
            .confidence,
      });
    }

    /*
     * --------------------------------
     * GRAPH RELEVANCE RANKING
     * --------------------------------
     *
     * Direct entity:
     * confidence
     *
     * Depth 1:
     * confidence / 1
     *
     * Depth 2:
     * confidence / 2
     *
     * Depth 3:
     * confidence / 3
     */

    items.sort((a, b) => {
      const scoreA =
        a.depth === 0
          ? a.confidence
          : a.confidence / a.depth;

      const scoreB =
        b.depth === 0
          ? b.confidence
          : b.confidence / b.depth;

      return scoreB - scoreA;
    });

    return items;
  }
}