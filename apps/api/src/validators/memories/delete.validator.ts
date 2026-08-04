import { z } from "zod";

export const deleteSchema = z.object({
  id: z.string().trim().min(1),
});

export type DeleteInput = z.infer<typeof deleteSchema>;