import { describe, expect, test } from "bun:test";

import { RuleBasedExtractor } from "../src/strategies";

describe("RuleBasedExtractor", () => {
  const extractor = new RuleBasedExtractor();

  test("should extract identity", async () => {
    const memories = await extractor.extract(["My name is Yogesh"]);

    expect(memories).toHaveLength(1);

    expect(memories[0]).toMatchObject({
      type: "identity",
      value: "Yogesh",
      confidence: 0.99,
    });
  });

  test("should extract project", async () => {
    const memories = await extractor.extract(["I work on Persista"]);

    expect(memories).toHaveLength(1);

    expect(memories[0]).toMatchObject({
      type: "fact",
      value: "Persista",
    });
  });

  test("should extract preference", async () => {
    const memories = await extractor.extract(["I prefer TypeScript"]);

    expect(memories).toHaveLength(1);

    expect(memories[0]).toMatchObject({
      type: "preference",
      value: "TypeScript",
    });
  });

  test("should extract learning goal", async () => {
    const memories = await extractor.extract(["I'm learning Rust"]);

    expect(memories).toHaveLength(1);

    expect(memories[0]).toMatchObject({
      type: "goal",
      value: "Rust",
    });
  });

  test("should return empty array when nothing matches", async () => {
    const memories = await extractor.extract(["Today is a sunny day"]);

    expect(memories).toHaveLength(0);
  });

  test("should extract multiple memories", async () => {
    const memories = await extractor.extract([
      "My name is Yogesh",
      "I work on Persista",
      "I like Bun",
    ]);

    expect(memories).toHaveLength(3);

    expect(memories.map((m) => m.type)).toEqual([
      "identity",
      "fact",
      "preference",
    ]);
  });
});
