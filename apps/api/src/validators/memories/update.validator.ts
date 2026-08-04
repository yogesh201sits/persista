import { z } from "zod";

import { metadataSchema } from "../common";

export const updateSchema = z
  .object({
    content: z.string().trim().min(1).optional(),
    metadata: metadataSchema.optional(),
  })
  .refine(
    (data) => data.content !== undefined || data.metadata !== undefined,
    {
      message: "At least one field must be provided.",
    },
  );

export type UpdateInput = z.infer<typeof updateSchema>;