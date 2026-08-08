import { z } from "zod";

export const envSchema = z.object({
  GROQ_API_KEY: z.string().min(1),
});

export const config = {
  groqApiKey: process.env.GROQ_API_KEY,
  hfToken: process.env.HF_TOKEN,
  qdrantUrl:process.env.QDRANT_URL,
  qdrantApiKey: process.env.QDRANT_API_KEY
};

export const hfToken = {

}