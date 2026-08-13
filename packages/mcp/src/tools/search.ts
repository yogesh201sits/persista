import { z } from "zod";

import { client } from "../client";

export const searchTool = {
  name: "search",

  description:
    "Search memories using semantic retrieval.",

  schema: {
    query: z.string(),
    limit: z.number().optional(),
  },

  handler: async ({
    query,
    limit,
  }: {
    query: string;
    limit?: number;
  }) => {
    const results =
      await client.search(query, {
        limit,
      });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            results,
            null,
            2,
          ),
        },
      ],
    };
  },
};