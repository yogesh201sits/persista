import type { EmbeddingProvider } from "@persista/shared";

export class EmbeddingClient {
  constructor(
    private readonly provider: EmbeddingProvider,
  ) {}

  async embed(text: string): Promise<number[]> {
    return this.provider.embed(text);
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    return this.provider.embedBatch(texts);
  }
}