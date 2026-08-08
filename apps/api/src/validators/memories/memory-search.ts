import { z } from "zod";

export const memorySearchRequestSchema =
  z.object({
    query: z.string().min(1),

    limit: z
      .number()
      .int()
      .positive()
      .max(100)
      .optional(),

    minScore: z
      .number()
      .min(0)
      .max(1)
      .optional(),
  });