export type EmbeddingProviderType =
  | "openai"
  | "ollama"
  | "voyage"
  | "huggingface"
  | "custom";

export type VectorStoreType =
  | "pinecone"
  | "qdrant"
  | "chroma"
  | "weaviate"
  | "pgvector";
