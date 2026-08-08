import type { VectorStore } from "../interfaces";

import { QdrantVectorStore, type QdrantVectorStoreOptions } from "../providers";

export type VectorStoreType = "qdrant";

export interface VectorStoreFactoryOptions {
  type: VectorStoreType;

  config: QdrantVectorStoreOptions;
}

export class VectorStoreFactory {
  static create(options: VectorStoreFactoryOptions): VectorStore {
    switch (options.type) {
      case "qdrant":
        return new QdrantVectorStore(options.config);

      default:
        throw new Error(`Unsupported vector store: ${options.type}`);
    }
  }
}
