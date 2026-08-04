import { z } from "zod";

export const searchSchema = z.object({
  namespace: z.string().trim().min(1),
  query: z.string().trim().optional(),
  limit: z.number().int().positive().max(100).optional(),
  cursor: z.string().optional(),
});

export type SearchInput = z.infer<typeof searchSchema>;
