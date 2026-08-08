import { config } from "./env";

import {
  ExtractorFactory,
  LangChainProvider,
} from "@persista/extractor";

import { HuggingFaceProvider } from "@persista/embeddings";

import { QdrantVectorStore } from "@persista/vector-store";

import { DefaultMemoryManager } from "@persista/core";

const llmProvider = new LangChainProvider({
  apiKey: config.groqApiKey!,
  model: "llama-3.3-70b-versatile",
});

const extractor = ExtractorFactory.create({
  type: "llm",
  llmProvider,
});

const embeddingProvider =
  new HuggingFaceProvider({
    apiKey: config.hfToken!,
     model: "sentence-transformers/distiluse-base-multilingual-cased-v2",
  dimensions: 512,
  });

const vectorStore = new QdrantVectorStore({
  url: config.qdrantUrl!,
  apiKey: config.qdrantApiKey,
  collection: "persista-vector-test",
  dimensions: 512,
});

const memoryManager =
  new DefaultMemoryManager(
    extractor,
    embeddingProvider,
    vectorStore,
  );

await memoryManager.remember({
  messages: [
    {
      role: "user",
      content:
        "My name is Yogesh. I prefer TypeScript and I'm building Persista.",
    },
  ],
});

const results = await memoryManager.search(
  "What programming language do I prefer?",
);

console.log(results);