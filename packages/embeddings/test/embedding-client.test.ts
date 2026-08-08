import { describe, expect, mock, test } from "bun:test";

import type { EmbeddingProvider } from "@persista/shared";

import { EmbeddingClient } from "../src/client";

describe("EmbeddingClient", () => {
  const provider: EmbeddingProvider = {
    provider: "huggingface",

    embed: mock(() => Promise.resolve([1, 2, 3])),

    embedBatch: mock(() =>
      Promise.resolve([
        [1, 2, 3],
        [4, 5, 6],
      ]),
    ),

    dimensions: mock(() => Promise.resolve(384)),
  };

  const client = new EmbeddingClient(provider);

  test("should embed text", async () => {
    const result = await client.embed("Hello");

    expect(result).toEqual([1, 2, 3]);
  });

  test("should embed batch", async () => {
    const result = await client.embedBatch(["Hello", "World"]);

    expect(result).toEqual([
      [1, 2, 3],
      [4, 5, 6],
    ]);
  });
});
