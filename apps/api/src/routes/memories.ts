import { Hono } from "hono";
import { rememberRequestSchema } from "../validators/memories";

import { memoryManager } from "../container";

const memories = new Hono();

memories.post("/", async (c) => {
  const body = await c.req.json();

  const parsed =
    rememberRequestSchema.safeParse(body);

  if (!parsed.success) {
    return c.json(
      {
        error: "Invalid request",
        details: parsed.error.flatten(),
      },
      400,
    );
  }

  await memoryManager.remember(
    parsed.data.conversation,
  );

  return c.json({
    success: true,
  });
});

export default memories;