import { z } from "zod";

import { metadataSchema } from "../common";

export const rememberSchema = z.object({
  namespace: z.string().trim().min(1),
  content: z.string().trim().min(1),
  metadata: metadataSchema.optional(),
});

export type RememberInput = z.infer<typeof rememberSchema>;
