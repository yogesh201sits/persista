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
  },

  handler: async ({
    query,
    entity,
    depth,
  }: {
    query: string;
    entity?: string;
    depth?: number;
  }) => {
    const results =
      await client.hybridSearch(query, {
        entity,
        depth,
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