import { z } from "zod";

import { client } from "../client";

export const searchTool = {
  name: "search",

  description:
    "Search memories using semantic retrieval.",

  schema: {
    query: z.string(),
    limit: z.number().optional(),
    minScore: z.number().optional(),
  },

  handler: async ({
    query,
    limit,
    minScore,
  }: {
    query: string;
    limit?: number;
    minScore?: number;
  }) => {
    const results = await client.search(query, {
      limit,
      minScore,
    });

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  },
};