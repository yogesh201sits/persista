import {
  describe,
  expect,
  it,
} from "bun:test";

import {
  calculateGraphRelevance,
} from "../src";

describe(
  "calculateGraphRelevance",
  () => {
    it(
      "should give full relevance to a direct relationship",
      () => {
        const result = {
          entity: {
            id: "entity-1",
            name: "CodePilot",
            type: "project",
            metadata: {},
          },

          relationships: [
            {
              relationship: {
                id: "relationship-1",
                sourceId: "entity-1",
                targetId: "entity-2",
                type: "uses",
                confidence: 1,
                metadata: {},
              },

              entity: {
                id: "entity-2",
                name: "React",
                type: "technology",
                metadata: {},
              },

              depth: 1,
            },
          ],
        };

        const score =
          calculateGraphRelevance(
            result,
          );

        expect(score).toBe(1);
      },
    );

    it(
      "should reduce relevance for deeper relationships",
      () => {
        const result = {
          entity: {
            id: "entity-1",
            name: "CodePilot",
            type: "project",
            metadata: {},
          },

          relationships: [
            {
              relationship: {
                id: "relationship-1",
                sourceId: "entity-1",
                targetId: "entity-2",
                type: "uses",
                confidence: 1,
                metadata: {},
              },

              entity: {
                id: "entity-2",
                name: "Vite",
                type: "technology",
                metadata: {},
              },

              depth: 2,
            },
          ],
        };

        const score =
          calculateGraphRelevance(
            result,
          );

        expect(score).toBe(0.5);
      },
    );
  },
);