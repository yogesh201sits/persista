import { Hono } from "hono";

import { graphRetrievalEngine } from "../container";

import { validateBody } from "../middleware";

import { graphSearchRequestSchema } from "../validators";

const graphSearch = new Hono();

graphSearch.post("/", validateBody(graphSearchRequestSchema), async (c) => {
  const body = c.get("body") as {
    entity: string;
    depth?: number;
  };

  const result = await graphRetrievalEngine.search(body.entity, body.depth);

  return c.json({
    success: true,
    result,
  });
});

export default graphSearch;
