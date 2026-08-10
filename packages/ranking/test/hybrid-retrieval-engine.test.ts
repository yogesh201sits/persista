import {
  describe,
  expect,
  it,
} from "bun:test";

import {
  DefaultHybridRetrievalEngine,
} from "../src";

import type { VectorSearchResult } from "@persista/vector-store";

describe(
  "DefaultHybridRetrievalEngine",
  () => {
    it(
  "should use related graph entities for hybrid scoring",
  async () => {
    const vectorResults: VectorSearchResult[] = [
      {
        id: "memory-react",
        score: 0.8,
        metadata: {
          content:
            "I prefer React for frontend development",
          type: "preference",
          confidence: 1,
          createdAt:
            "2026-08-10T00:00:00.000Z",
        },
      },
    ];

    const vectorEngine = {
      search: async (
        _query: string,
      ): Promise<VectorSearchResult[]> => {
        return vectorResults;
      },
    };

    const graphEngine = {
      search: async () => ({
        entity: {
          id: "codepilot",
          name: "CodePilot",
          type: "project",
          metadata: {},
        },

        relationships: [
          {
            relationship: {
              id: "relationship-react",
              sourceId: "codepilot",
              targetId: "react",
              type: "uses",
              confidence: 1,
              metadata: {},
            },

            entity: {
              id: "react",
              name: "React",
              type: "technology",
              metadata: {},
            },

            depth: 1,
          },
        ],
      }),
    };

    const engine =
      new DefaultHybridRetrievalEngine(
        vectorEngine,
        graphEngine,
      );

    const result =
      await engine.search(
        "What frontend technology?",
      );

    expect(
      result.results[0].sources,
    ).toEqual([
      "vector",
      "graph",
    ]);

    expect(
      result.results[0].score,
    ).toBeGreaterThan(0.8);
  },
);
  },
);