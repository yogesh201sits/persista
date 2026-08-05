export type EmbeddingProviderType =
  | "openai"
  | "ollama"
  | "fastembed"
  | "huggingface"
  | "custom";

export type VectorStoreType =
  | "pinecone"
  | "qdrant"
  | "chroma"
  | "weaviate"
  | "pgvector";
