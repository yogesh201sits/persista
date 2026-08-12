import { z } from "zod";

export const graphExtractionSchema = z.object({
  entities: z.array(
    z.object({
      name: z.string().min(1),

      type: z.string().min(1),

      confidence: z.number().min(0).max(1),
    }),
  ),

  relationships: z.array(
    z.object({
      source: z.string().min(1),

      target: z.string().min(1),

      type: z.string().min(1),

      confidence: z.number().min(0).max(1),
    }),
  ),
});
