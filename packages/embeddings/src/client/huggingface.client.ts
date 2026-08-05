import { InferenceClient } from "@huggingface/inference";

export interface HuggingFaceClientOptions {
  apiKey: string;
}

export class HuggingFaceClient {
  private readonly client: InferenceClient;

  constructor(options: HuggingFaceClientOptions) {
    this.client = new InferenceClient(options.apiKey);
  }

  async embed(
    model: string,
    text: string,
  ): Promise<number[]> {
    const embedding = await this.client.featureExtraction({
      model,
      inputs: text,
    });

    return embedding as number[];
  }

  async embedBatch(
    model: string,
    texts: string[],
  ): Promise<number[][]> {
    return Promise.all(
      texts.map((text) => this.embed(model, text)),
    );
  }
}