import { Hono } from "hono";

import { memoryManager } from "../container";
import { validateBody } from "../middleware";
import { rememberRequestSchema } from "../validators/memories";

const memories = new Hono();

memories.post(
  "/",
  validateBody(rememberRequestSchema),
  async (c) => {
    const body = c.get("body") as {
      conversation: {
        messages: {
          role:
            | "system"
            | "user"
            | "assistant";
          content: string;
        }[];
      };
    };

    await memoryManager.remember(
      body.conversation,
    );

    return c.json({
      success: true,
    });
  },
);

export default memories;