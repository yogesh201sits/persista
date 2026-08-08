import { Hono } from "hono";
import { memoryManager } from "../container";
import { memorySearchRequestSchema } from "../validators";
import {z} from "zod";

const memoriesSearch = new Hono();

memoriesSearch.post("/", async (c) => {
  const body = await c.req.json();

  const parsed =
    memorySearchRequestSchema.safeParse(body);

  if (!parsed.success) {
    return c.json(
      {
        error: "Invalid request",
        details: z.treeifyError(parsed.error),
      },
      400,
    );
  }

  const results = await memoryManager.search(
    parsed.data.query,
    {
      limit: parsed.data.limit ?? 10,
    },
  );

  return c.json({
    results,
  });
});

export default memoriesSearch;