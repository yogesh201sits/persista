import { describe, expect, mock, test } from "bun:test";

import type { Conversation } from "@persista/shared";
import type { Extractor } from "@persista/extractor";
import type { EmbeddingProvider } from "@persista/shared";
import type { VectorStore, VectorMemory } from "@persista/vector-store";

import { DefaultMemoryManager } from "../memory";

describe("DefaultMemoryManager", () => {
  const conversation: Conversation = {
    messages: [
      {
        role: "user",
        content: "My name is Yogesh.",
      },
      {
        role: "user",
        content: "I prefer TypeScript.",
      },
    ],
  };

  test("should extract, embed, and store memories", async () => {
    const extractor = {
      extract: mock(async () => ({
        memories: [
          {
            content: "My name is Yogesh.",
            type: "identity" as const,
            confidence: 0.99,
            value: "Yogesh",
          },
          {
            content: "I prefer TypeScript.",
            type: "preference" as const,
            confidence: 0.95,
            value: "TypeScript",
          },
        ],
        processingTime: 1,
      })),
    } as unknown as Extractor;

    const embeddingProvider = {
      provider: "huggingface" as const,

      embed: mock(async () => [0.1, 0.2, 0.3]),

      embedBatch: mock(async () => [
        [0.1, 0.2, 0.3],
        [0.4, 0.5, 0.6],
      ]),

      dimensions: mock(async () => 3),
    } as unknown as EmbeddingProvider;

    const storedMemories: VectorMemory[] = [];

    const vectorStore = {
      upsert: mock(async () => {}),

      upsertBatch: mock(async (memories: VectorMemory[]) => {
        storedMemories.push(...memories);
      }),

      search: mock(async () => []),

      delete: mock(async () => {}),

      clear: mock(async () => {}),
    } as unknown as VectorStore;

    const manager = new DefaultMemoryManager(
      extractor,
      embeddingProvider,
      vectorStore,
    );

    await manager.remember("user-123", conversation);

    expect(extractor.extract).toHaveBeenCalledTimes(1);

    expect(embeddingProvider.embedBatch).toHaveBeenCalledTimes(1);

    expect(embeddingProvider.embedBatch).toHaveBeenCalledWith([
      "My name is Yogesh.",
      "I prefer TypeScript.",
    ]);

    expect(vectorStore.upsertBatch).toHaveBeenCalledTimes(1);

    expect(storedMemories).toHaveLength(2);

    expect(storedMemories[0].namespace).toBe("user-123");

    expect(storedMemories[0].metadata!.content).toBe("My name is Yogesh.");

    expect(storedMemories[0].metadata!.type).toBe("identity");

    expect(storedMemories[0].metadata!.confidence).toBe(0.99);

    expect(storedMemories[0].embedding).toEqual([0.1, 0.2, 0.3]);
  });

  test("should not embed or store when no memories are extracted", async () => {
    const extractor = {
      extract: mock(async () => ({
        memories: [],
        processingTime: 1,
      })),
    } as unknown as Extractor;

    const embeddingProvider = {
      provider: "huggingface" as const,
      embed: mock(async () => []),
      embedBatch: mock(async () => []),
      dimensions: mock(async () => 384),
    } as unknown as EmbeddingProvider;

    const vectorStore = {
      upsert: mock(async () => {}),
      upsertBatch: mock(async () => {}),
      search: mock(async () => []),
      delete: mock(async () => {}),
      clear: mock(async () => {}),
    } as unknown as VectorStore;

    const manager = new DefaultMemoryManager(
      extractor,
      embeddingProvider,
      vectorStore,
    );

    await manager.remember("user-123", conversation);

    expect(embeddingProvider.embedBatch).not.toHaveBeenCalled();

    expect(vectorStore.upsertBatch).not.toHaveBeenCalled();
  });
});
