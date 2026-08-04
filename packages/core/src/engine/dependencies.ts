import type {
  EmbeddingProvider,
  Extractor,
  GraphStore,
  Logger,
  MemoryStore,
  Ranker,
  VectorStore,
} from "@persista/shared";

export interface MemoryEngineDependencies {
  extractor: Extractor;

  embeddings: EmbeddingProvider;

  vectorStore: VectorStore;

  memoryStore: MemoryStore;

  ranker: Ranker;

  graphStore?: GraphStore;

  logger: Logger;
}
