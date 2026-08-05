import type {
    EmbeddingProvider,
    EmbeddingProviderType,
} from "@persista/shared";

import { HuggingFaceClient } from "../client";

export interface HuggingFaceProviderOptions {
  apiKey: string;

  model: string;

  dimensions: number;
}

export class HuggingFaceProvider implements EmbeddingProvider {
  readonly provider: EmbeddingProviderType = "huggingface";

  private readonly client: HuggingFaceClient;

  constructor(
    private readonly options: HuggingFaceProviderOptions,
  ) {
    this.client = new HuggingFaceClient({
      apiKey: options.apiKey,
    });
  }

  async embed(text: string): Promise<number[]> {
    if (!text.trim()) {
      throw new Error("Text cannot be empty.");
    }

    return this.client.embed(this.options.model, text);
  }

  async embedBatch(
    texts: string[],
  ): Promise<number[][]> {
    if (texts.length === 0) {
      return [];
    }

    return this.client.embedBatch(
      this.options.model,
      texts,
    );
  }

  async dimensions(): Promise<number> {
    return this.options.dimensions;
  }
}