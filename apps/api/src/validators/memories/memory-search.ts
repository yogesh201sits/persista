import { z } from "zod";

export const memorySearchRequestSchema = z.object({
  query: z.string().min(1),

  limit: z.number().int().positive().max(100).optional(),

  minScore: z.number().min(0).max(1).optional(),

  filter: z.record(z.string(), z.unknown()).optional(),
});

export const graphSearchRequestSchema = z.union([
  z.object({
    entity: z.string().min(1),
    depth: z.number().int().min(1).max(5).optional(),
  }),

  z.object({
    query: z.string().min(1),
    depth: z.number().int().min(1).max(5).optional(),
  }),
]);