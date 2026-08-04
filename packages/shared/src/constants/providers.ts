export const EMBEDDING_PROVIDERS = [
  "openai",
  "ollama",
  "voyage",
  "cohere",
  "custom",
] as const;

export const VECTOR_STORES = [
  "pinecone",
  "qdrant",
  "chroma",
  "pgvector",
] as const;