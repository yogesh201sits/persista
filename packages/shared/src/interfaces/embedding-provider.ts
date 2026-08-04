import type { EmbeddingProviderType } from "../types";

export interface EmbeddingProvider {
  readonly provider: EmbeddingProviderType;

  embed(text: string): Promise<number[]>;

  embedBatch(texts: string[]): Promise<number[][]>;
}
