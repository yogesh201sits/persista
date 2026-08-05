import { beforeEach, describe, expect, mock, test } from "bun:test";

import { HuggingFaceProvider } from "../src/providers";

describe("HuggingFaceProvider", () => {
  let provider: HuggingFaceProvider;

  beforeEach(() => {
    provider = new HuggingFaceProvider({
      apiKey: "test-api-key",
      model: "BAAI/bge-small-en-v1.5",
      dimensions: 384,
    });
  });

  test("should expose provider type", () => {
    expect(provider.provider).toBe("huggingface");
  });

  test("should return configured dimensions", async () => {
    expect(await provider.dimensions()).toBe(384);
  });

  test("should reject empty text", async () => {
    await expect(provider.embed("")).rejects.toThrow(
      "Text cannot be empty.",
    );
  });

  test("should return empty array for empty batch", async () => {
    const result = await provider.embedBatch([]);

    expect(result).toEqual([]);
  });

  test("should delegate embed() to client", async () => {
    const expected = Array.from({ length: 384 }, () => Math.random());

    const spy = mock(() => Promise.resolve(expected));

    (provider as any).client.embed = spy;

    const result = await provider.embed("Hello Persista");

    expect(result).toEqual(expected);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      "BAAI/bge-small-en-v1.5",
      "Hello Persista",
    );
  });

  test("should delegate embedBatch() to client", async () => {
    const expected = [
      Array.from({ length: 384 }, () => Math.random()),
      Array.from({ length: 384 }, () => Math.random()),
    ];

    const spy = mock(() => Promise.resolve(expected));

    (provider as any).client.embedBatch = spy;

    const result = await provider.embedBatch([
      "Hello",
      "Persista",
    ]);

    expect(result).toEqual(expected);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      "BAAI/bge-small-en-v1.5",
      ["Hello", "Persista"],
    );
  });
});