import { z } from "zod";

import { client } from "../client";

export const recallTool = {
  name: "recall",

  description:
    "Recall information using hybrid retrieval.",

  schema: {
    query: z.string(),
    entity: z.string().optional(),
    depth: z.number().optional(),
    limit: z.number().optional(),
    minScore: z.number().optional(),
  },

  handler: async ({
    query,
    entity,
    depth,
    limit,
    minScore,
  }: {
    query: string;
    entity?: string;
    depth?: number;
    limit?: number;
    minScore?: number;
  }) => {
    const results = await client.hybridSearch(query, {
      entity,
      depth,
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