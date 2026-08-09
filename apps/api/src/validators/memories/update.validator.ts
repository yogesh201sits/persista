import { z } from "zod";

import { metadataSchema } from "../common";

export const updateSchema = z
  .object({
    content: z.string().trim().min(1).optional(),
    metadata: metadataSchema.optional(),
  })
  .refine((data) => data.content !== undefined || data.metadata !== undefined, {
    message: "At least one field must be provided.",
  });

export const updateMemoryRequestSchema =
  z.object({
    id: z.string().min(1),
    content: z.string().min(1),

    type: z.enum([
      "fact",
      "identity",
      "preference",
      "goal",
      "relationship",
    ]),

    confidence: z
      .number()
      .min(0)
      .max(1),

    value: z.string().optional(),
  });

export type UpdateInput = z.infer<typeof updateSchema>;
