import { describe, expect, test } from "bun:test";
import { QdrantClient } from "@qdrant/js-client-rest";

describe("Qdrant Connection", () => {
  test("should connect to Qdrant Cloud", async () => {
    const client = new QdrantClient({
      url: process.env.QDRANT_URL!,
      apiKey: process.env.QDRANT_API_KEY!,
    });

    const collections = await client.getCollections();

    expect(collections).toBeDefined();
    expect(Array.isArray(collections.collections)).toBe(true);
  });
});