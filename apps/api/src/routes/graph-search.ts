import { Hono } from "hono";

import { graphRetrievalEngine } from "../container";

import { validateBody } from "../middleware";

import { graphSearchRequestSchema } from "../validators";

const graphSearch = new Hono();

graphSearch.post(
  "/",
  validateBody(graphSearchRequestSchema),
  async (c) => {
    const body = c.get("body") as
      | {
          entity: string;
          depth?: number;
        }
      | {
          query: string;
          depth?: number;
        };

    if ("query" in body) {
      const result =
        await graphRetrievalEngine.searchQuery(
          body.query,
          body.depth,
        );

      return c.json({
        success: true,
        result,
      });
    }

    const result =
      await graphRetrievalEngine.search(
        body.entity,
        body.depth,
      );

    return c.json({
      success: true,
      result,
    });
  },
);

export default graphSearch;
