import { z } from "zod";

export const envSchema = z.object({
  GROQ_API_KEY: z.string().min(1),
});

export const config = {
  groqApiKey: process.env.GROQ_API_KEY,
  hfToken: process.env.HF_TOKEN,
  qdrantUrl: process.env.QDRANT_URL,
  qdrantApiKey: process.env.QDRANT_API_KEY,
  neo4jUri: process.env.NEO4J_URI,
  neo4jUsername: process.env.NEO4J_USERNAME,
  neo4jPassword: process.env.NEO4J_PASSWORD,
};

export const hfToken = {};
