import { Hono } from "hono";

import type { VectorSearchOptions } from "@persista/vector-store";

import {
  memoryManager,
  graphRetrievalEngine,
} from "../container";

import { validateBody } from "../middleware";
import { hybridSearchRequestSchema } from "../validators";

const hybridSearch = new Hono();

hybridSearch.post(
  "/",
  validateBody(hybridSearchRequestSchema),
  async (c) => {
    const body = c.get("body") as {
      query: string;
      entity?: string;
      limit?: number;
      minScore?: number;
      depth?: number;
      filter?: VectorSearchOptions["filter"];
    };

    const [vectorResults, graphResult] = await Promise.all([
      memoryManager.search(body.query, {
        limit: body.limit ?? 10,
        minScore: body.minScore,
        filter: body.filter,
      }),

      body.entity
        ? graphRetrievalEngine.search(
            body.entity,
            body.depth,
          )
        : graphRetrievalEngine.searchQuery(
            body.query,
            body.depth,
          ),
    ]);

    return c.json({
      success: true,
      results: {
        vector: vectorResults,
        graph: graphResult,
      },
    });
  },
);

export default hybridSearch;