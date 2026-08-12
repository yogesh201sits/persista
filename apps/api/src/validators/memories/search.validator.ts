import { z } from "zod";

export const searchSchema = z.object({
  namespace: z.string().trim().min(1),
  query: z.string().trim().optional(),
  limit: z.number().int().positive().max(100).optional(),
  cursor: z.string().optional(),
});

export const hybridSearchRequestSchema = z.object({
  query: z.string().min(1),

  entity: z.string().optional(),

  limit: z.number().int().positive().max(100).optional(),

  minScore: z.number().min(0).max(1).optional(),

  depth: z.number().int().positive().max(10).optional(),

  filter: z.record(z.string(), z.any()).optional(),
});

export type SearchInput = z.infer<typeof searchSchema>;
