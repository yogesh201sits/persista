import { z } from "zod";

export const deleteNamespaceSchema = z.object({
  id: z.string().trim().min(1),
});

export type DeleteNamespaceInput = z.infer<
  typeof deleteNamespaceSchema
>;