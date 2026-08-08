import { z } from "zod";

import { metadataSchema } from "../common";

export const rememberSchema = z.object({
  namespace: z.string().trim().min(1),
  content: z.string().trim().min(1),
  metadata: metadataSchema.optional(),
});

export const rememberRequestSchema = z.object({
  conversation: z.object({
    messages: z.array(
      z.object({
        role: z.enum([
          "system",
          "user",
          "assistant",
        ]),
        content: z.string().min(1),
      }),
    ),
  }),
});

export type RememberInput = z.infer<typeof rememberSchema>;
