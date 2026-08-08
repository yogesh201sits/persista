import type {
  EmbeddingProvider,
  EmbeddingProviderType,
} from "@persista/shared";

import { FastEmbedClient } from "../client";
import { EmbeddingModel } from "fastembed";

export interface FastEmbedProviderOptions {
  model?: EmbeddingModel;
  dimensions?: number;
}

export class FastEmbedProvider implements EmbeddingProvider {
  readonly provider: EmbeddingProviderType = "fastembed";

  private readonly client: FastEmbedClient;

  constructor(private readonly options: FastEmbedProviderOptions = {}) {
    this.client = new FastEmbedClient({
      model: options.model,
    });
  }

  async embed(text: string): Promise<number[]> {
    if (!text.trim()) {
      throw new Error("Text cannot be empty.");
    }

    return this.client.embed(text);
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) {
      return [];
    }

    return this.client.embedBatch(texts);
  }

  async dimensions(): Promise<number> {
    return this.options.dimensions ?? 384;
  }
}
