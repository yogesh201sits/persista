import { z } from "zod";

import { client } from "../client";

export const rememberTool = {
  name: "remember",

  description:
    "Store a conversation in persistent memory.",

  schema: {
    conversation: z.any(),
  },

  handler: async ({
    conversation,
  }: {
    conversation: unknown;
  }) => {
    await client.remember(conversation);

    return {
      content: [
        {
          type: "text",
          text: "Memory stored successfully.",
        },
      ],
    };
  },
};