import { config } from "@persista/config";

import {
  ExtractorFactory,
  LangChainProvider,
} from "@persista/extractor";

import {
  DefaultMemoryDeduplicator,
  DefaultMemoryManager,
} from "@persista/core";

import { HuggingFaceProvider } from "@persista/embeddings";

import { QdrantVectorStore } from "@persista/vector-store";

import {
  DefaultRankingStrategy,
  DefaultRetrievalEngine,
} from "@persista/ranking";

import { QueryAnalyzer } from "@persista/ranking";

import {
  DefaultEntityResolver,
  GraphMemoryManager,
  LangChainGraphExtractor,
  Neo4jGraphStore,
  DefaultGraphRetrievalEngine,
} from "@persista/graph";

// ─────────────────────────────────────
// LLM
// ─────────────────────────────────────

if (!config.groqApiKey) {
  throw new Error("GROQ_API_KEY is not configured");
}

const llmProvider = new LangChainProvider({
  apiKey: config.groqApiKey,
  model: "llama-3.3-70b-versatile",
});

// ─────────────────────────────────────
// Memory Extractor
// ─────────────────────────────────────

const extractor = ExtractorFactory.create({
  type: "llm",
  llmProvider,
});

// ─────────────────────────────────────
// Embeddings
// ─────────────────────────────────────

if (!config.hfToken) {
  throw new Error("HF_TOKEN is not configured");
}

const embeddingProvider = new HuggingFaceProvider({
  apiKey: config.hfToken,
  model: "sentence-transformers/distiluse-base-multilingual-cased-v2",
  dimensions: 512,
});

// ─────────────────────────────────────
// Vector Store
// ─────────────────────────────────────

if (!config.qdrantUrl) {
  throw new Error("QDRANT_URL is not configured");
}

const vectorStore = new QdrantVectorStore({
  url: config.qdrantUrl,
  apiKey: config.qdrantApiKey,
  collection: "persista-vector-test",
  dimensions: 512,
});

// ─────────────────────────────────────
// Ranking
// ─────────────────────────────────────

const rankingStrategy = new DefaultRankingStrategy();

// ─────────────────────────────────────
// Deduplication
// ─────────────────────────────────────

const deduplicator = new DefaultMemoryDeduplicator({
  threshold: 0.95,
});

// ─────────────────────────────────────
// Vector Retrieval
// ─────────────────────────────────────
//
// Vector retrieval is completely independent
// from graph retrieval.
//
// MemoryManager uses this engine directly.

const vectorRetrievalEngine = new DefaultRetrievalEngine(
  embeddingProvider,
  vectorStore,
  rankingStrategy,
);

// ─────────────────────────────────────
// Graph Store
// ─────────────────────────────────────

if (
  !config.neo4jUri ||
  !config.neo4jUsername ||
  !config.neo4jPassword
) {
  throw new Error(
    "Neo4j configuration is not configured",
  );
}

const graphStore = new Neo4jGraphStore({
  uri: config.neo4jUri,
  username: config.neo4jUsername,
  password: config.neo4jPassword,
});

await graphStore.connect();

// ─────────────────────────────────────
// Graph Extractor
// ─────────────────────────────────────

const graphExtractor = new LangChainGraphExtractor(
  config.groqApiKey,
);

// ─────────────────────────────────────
// Entity Resolver
// ─────────────────────────────────────

const entityResolver = new DefaultEntityResolver(
  graphStore,
);

// ─────────────────────────────────────
// Graph Memory Manager
// ─────────────────────────────────────

export const graphMemory = new GraphMemoryManager(
  graphExtractor,
  entityResolver,
  graphStore,
);

// ─────────────────────────────────────
// Graph Retrieval
// ─────────────────────────────────────
//
// Graph retrieval remains completely
// independent from vector memory search.

const queryAnalyzer = new QueryAnalyzer(
  config.groqApiKey,
);

export const graphRetrievalEngine =
  new DefaultGraphRetrievalEngine(graphStore,queryAnalyzer);

// ─────────────────────────────────────
// Memory Manager
// ─────────────────────────────────────
//
// IMPORTANT:
// Use DefaultRetrievalEngine directly.
// Do NOT use DefaultHybridRetrievalEngine.
//
// This means:
//
// MemoryManager.search()
//        ↓
// DefaultRetrievalEngine
//        ↓
// VectorStore
//
// Graph search is exposed separately.

export const memoryManager = new DefaultMemoryManager(
  extractor,
  embeddingProvider,
  vectorStore,
  vectorRetrievalEngine,
  deduplicator,
);