import { z } from "zod";

export const recallSchema = z.object({
  namespace: z.string().trim().min(1),
  query: z.string().trim().min(1),
  limit: z.number().int().positive().max(100).optional(),
});

export type RecallInput = z.infer<typeof recallSchema>;