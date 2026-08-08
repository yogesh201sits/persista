import { config } from "@persista/config";

import {
  ExtractorFactory,
  LangChainProvider,
} from "@persista/extractor";

import { HuggingFaceProvider } from "@persista/embeddings";

import { QdrantVectorStore } from "@persista/vector-store";

import { DefaultMemoryManager } from "@persista/core";


let llmProvider;

if (!config.groqApiKey) {
  throw new Error("GROQ_API_KEY is not configured");
}

llmProvider = new LangChainProvider({
  apiKey: config.groqApiKey,
  model: "llama-3.3-70b-versatile",
});


const extractor = ExtractorFactory.create({
  type: "llm",
  llmProvider,
});


let embeddingProvider;

if (!config.hfToken) {
  throw new Error("HF_TOKEN is not configured");
}

embeddingProvider = new HuggingFaceProvider({
  apiKey: config.hfToken,
  model: "sentence-transformers/distiluse-base-multilingual-cased-v2",
  dimensions: 512,
});

if (!config.qdrantUrl) {
  throw new Error("QDRANT_URL is not configured");
}

const vectorStore = new QdrantVectorStore({
  url: config.qdrantUrl,
  apiKey: config.qdrantApiKey,
  collection: "persista-vector-test",
  dimensions: 512,
});


export const memoryManager = new DefaultMemoryManager(
  extractor,
  embeddingProvider,
  vectorStore,
);