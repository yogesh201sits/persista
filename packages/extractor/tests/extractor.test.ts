import { describe, expect, test } from "bun:test";

import { Extractor } from "../src/extractorF";

import {
  SentenceSplitter,
  TextCleaner,
  TextNormalizer,
} from "../src/preprocessors";

import { RuleBasedExtractor } from "../src/strategies";

describe("Extractor", () => {
  const extractor = new Extractor(
    new TextCleaner(),
    new TextNormalizer(),
    new SentenceSplitter(),
    new RuleBasedExtractor(),
  );

  test("should extract memories from a conversation", async () => {
    const conversation = {
      messages: [
        {
          role: "user",
          content: `
My name is Yogesh.
I work on Persista.
I prefer TypeScript.
I'm learning Rust.
`,
        },
      ],
    };

    const result = await extractor.extract(conversation as any);

    expect(result.memories).toHaveLength(4);

    expect(result.memories[0]).toMatchObject({
      type: "identity",
      value: "Yogesh",
    });

    expect(result.memories[1]).toMatchObject({
      type: "fact",
      value: "Persista",
    });

    expect(result.memories[2]).toMatchObject({
      type: "preference",
      value: "TypeScript",
    });

    expect(result.memories[3]).toMatchObject({
      type: "goal",
      value: "Rust",
    });

    expect(result.processingTime).toBeGreaterThanOrEqual(0);
  });

  test("should return no memories for an empty conversation", async () => {
    const conversation = {
      messages: [],
    };

    const result = await extractor.extract(conversation as any);

    expect(result.memories).toHaveLength(0);
  });

  test("should ignore unmatched sentences", async () => {
    const conversation = {
      messages: [
        {
          role: "user",
          content: `
Hello there.
Today is sunny.
I work on Persista.
`,
        },
      ],
    };

    const result = await extractor.extract(conversation as any);

    expect(result.memories).toHaveLength(1);

    expect(result.memories[0]).toMatchObject({
      type: "fact",
      value: "Persista",
    });
  });
});