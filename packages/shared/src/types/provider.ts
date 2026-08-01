export type EmbeddingProviderType =
  | "openai"
  | "ollama"
  | "voyage"
  | "cohere"
  | "custom";

export type VectorStoreType =
  | "pinecone"
  | "qdrant"
  | "chroma"
  | "weaviate"
  | "pgvector";