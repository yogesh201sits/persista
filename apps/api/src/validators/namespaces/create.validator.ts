import { z } from "zod";

export const createNamespaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .regex(/^[a-zA-Z0-9._-]+$/, {
      message:
        "Namespace may only contain letters, numbers, dots, hyphens, and underscores.",
    }),
});

export type CreateNamespaceInput = z.infer<
  typeof createNamespaceSchema
>;