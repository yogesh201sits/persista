export type EmbeddingProviderType =
  | "openai"
  | "ollama"
  | "fastembed"
  | "huggingface"
  | "voyage"
  | "cohere"
  | "custom";

export type VectorStoreType =
  | "pinecone"
  | "qdrant"
  | "chroma"
  | "weaviate"
  | "pgvector";
