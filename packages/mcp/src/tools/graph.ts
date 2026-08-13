import { z } from "zod";

import { client } from "../client";

export const graphTool = {
  name: "graph",

  description:
    "Explore graph relationships.",

  schema: {
    entity: z.string(),
    depth: z.number().optional(),
  },

  handler: async ({
    entity,
    depth,
  }: {
    entity: string;
    depth?: number;
  }) => {
    const results = await client.graphSearch(entity, {
      depth,
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