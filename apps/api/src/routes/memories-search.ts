import { Hono } from "hono";

import { memoryManager } from "../container";
import { validateBody } from "../middleware";

import {
  memorySearchRequestSchema,
} from "../validators";

const memoriesSearch = new Hono();

memoriesSearch.post("/",
  validateBody(memorySearchRequestSchema),
  async (c) => {
    const body = c.get("body") as {
      query: string;
      limit?: number;
    };

    const results =
      await memoryManager.search(
        body.query,
        {
          limit: body.limit ?? 10,
        },
      );

    return c.json({
      success: true,
      results,
    });
  },
);

export default memoriesSearch;