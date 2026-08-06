import { QdrantClient as QdrantSdk } from "@qdrant/js-client-rest";

export interface QdrantClientOptions {
  url: string;
  apiKey?: string;
  collection: string;
  dimensions: number;
}

export class QdrantClient {
  private readonly client: QdrantSdk;

  constructor(
    private readonly options: QdrantClientOptions,
  ) {
    this.client = new QdrantSdk({
      url: options.url,
      apiKey: options.apiKey,
    });
  }

  async ensureCollection(): Promise<void> {
    const collections = await this.client.getCollections();

    const exists = collections.collections.some(
      (c) => c.name === this.options.collection,
    );

    if (exists) {
      return;
    }

    await this.client.createCollection(this.options.collection, {
      vectors: {
        size: this.options.dimensions,
        distance: "Cosine",
      },
    });
  }

  async upsert(
    id: string,
    vector: number[],
    payload?: Record<string, unknown>,
  ): Promise<void> {
    await this.client.upsert(this.options.collection, {
      wait: true,
      points: [
        {
          id,
          vector,
          payload,
        },
      ],
    });
  }

  async upsertBatch(
    points: {
      id: string;
      vector: number[];
      payload?: Record<string, unknown>;
    }[],
  ): Promise<void> {
    await this.client.upsert(this.options.collection, {
      wait: true,
      points,
    });
  }

  async search(
    vector: number[],
    limit = 10,
  ) {
    return this.client.query(this.options.collection, {
      query: vector,
      limit,
      with_payload: true,
    });
  }

  async delete(id: string): Promise<void> {
    await this.client.delete(this.options.collection, {
      wait: true,
      points: [id],
    });
  }

  async clear(): Promise<void> {
    await this.client.delete(this.options.collection, {
      wait: true,
      filter: {},
    });
  }
}