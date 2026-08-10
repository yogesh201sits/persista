import { Hono } from "hono";

import {graphMemory,memoryManager,} from "../container";

import { validateBody } from "../middleware";

import {rememberRequestSchema,updateMemoryRequestSchema,} from "../validators";

const memories = new Hono();

memories.post(
  "/",
  validateBody(
    rememberRequestSchema,
  ),
  async (c) => {
    const body =
      c.get("body") as {
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

    await graphMemory.remember(
      body.conversation,
    );

    return c.json({
      success: true,
    });
  },
);

memories.delete(
  "/:id",
  async (c) => {
    const id =
      c.req.param("id");

    await memoryManager.delete(id);

    return c.json({
      success: true,
    });
  },
);

memories.put(
  "/:id",
  validateBody(
    updateMemoryRequestSchema,
  ),
  async (c) => {
    const id =
      c.req.param("id");

    const body =
      c.get("body") as {
        content: string;
        type:
          | "fact"
          | "identity"
          | "preference"
          | "goal"
          | "relationship";
        confidence: number;
        value?: string;
      };

    await memoryManager.update({
      id,
      content: body.content,
      type: body.type,
      confidence: body.confidence,
      value: body.value,
    });

    return c.json({
      success: true,
    });
  },
);

export default memories;