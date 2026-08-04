import { z } from "zod";

export const listNamespacesSchema = z.object({
  limit: z.number().int().positive().max(100).optional(),
  cursor: z.string().optional(),
});

export type ListNamespacesInput = z.infer<
  typeof listNamespacesSchema
>;