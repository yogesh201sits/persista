import { z } from "zod";

export const extractedMemorySchema = z.object({
  content: z.string().min(1),

  type: z.enum(["fact", "identity", "preference", "goal", "relationship"]),

  confidence: z.number().min(0).max(1),

  value: z.string().optional(),
});

export const extractedMemoriesSchema = z.object({
  memories: z.array(extractedMemorySchema),
});
