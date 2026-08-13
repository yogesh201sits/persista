import { z } from "zod";

import { client } from "../client";

const ConversationSchema = z.object({
  messages: z.array(z.any()),
});

export const rememberTool = {
  name: "remember",

  description:
    "Store a conversation in persistent memory.",

  schema: {
    conversation: ConversationSchema,
  },

  handler: async (args: {
    conversation: z.infer<
      typeof ConversationSchema
    >;
  }) => {
    await client.remember(
      args.conversation,
    );

    return {
      content: [
        {
          type: "text" as const,
          text:
            "Memory stored successfully.",
        },
      ],
    };
  },
};