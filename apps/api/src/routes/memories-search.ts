import { Hono } from "hono";

import { memoryManager } from "../container";
import { validateBody } from "../middleware";

import {
  memorySearchRequestSchema,
} from "../validators";

const memoriesSearch = new Hono();

memoriesSearch.post(
  "/",
  validateBody(memorySearchRequestSchema),
  async (c) => {
    const body = c.get("body") as {
      query: string;
      limit?: number;
      minScore?: number;
      filter?: Record<string, unknown>;
    };

    const results =
      await memoryManager.search(
        body.query,
        {
          limit: body.limit ?? 10,
          minScore: body.minScore,
          filter: body.filter,
        },
      );

    return c.json({
      success: true,
      results,
    });
  },
);

export default memoriesSearch;