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
      "should retrieve from vector and graph",
      async () => {
        const vectorResults: VectorSearchResult[] = [
            {
                id: "memory-1",
                score: 0.9,
                metadata: {
                content: "CodePilot uses React",
                type: "fact",
                confidence: 1,
                createdAt: "2026-08-10T00:00:00.000Z",
                },
            },
            ];

            const vectorEngine = {
            search: async (): Promise<VectorSearchResult[]> => {
                return vectorResults;
            },
        };
        const graphEngine = {
          search: async () => ({
            entity: {
              id: "entity-1",
              name: "CodePilot",
              type: "project",
              metadata: {},
            },

            relationships: [],
          }),
        };

        const engine =
          new DefaultHybridRetrievalEngine(
            vectorEngine,
            graphEngine,
          );

        const result =
          await engine.search(
            "CodePilot",
          );

        expect(result.query)
          .toBe("CodePilot");

        expect(
          result.results.length,
        ).toBe(2);

        expect(
          result.results[0].sources,
        ).toEqual(["vector"]);

        expect(
          result.results[1].sources,
        ).toEqual(["graph"]);
      },
    );
  },
);