import { describe, expect, mock, test } from "bun:test";
import { LLMExtractor } from "../src/strategies/llm.extractor";
import type { LLMProvider } from "../src/providers/llm-provider";

describe("LLMExtractor", () => {
  test("should return empty array for empty sentences", async () => {
    const generate = mock(async () => "[]");

    const llm: LLMProvider = {
      generate,
    };

    const extractor = new LLMExtractor(llm);

    const result = await extractor.extract([]);

    expect(result).toEqual([]);
    expect(generate).not.toHaveBeenCalled();
  });

  test("should extract memories from LLM response", async () => {
    const generate = mock(async () =>
      JSON.stringify([
        {
          content: "I prefer TypeScript.",
          type: "preference",
          confidence: 0.95,
          value: "TypeScript",
        },
      ]),
    );

    const llm: LLMProvider = {
      generate,
    };

    const extractor = new LLMExtractor(llm);

    const result = await extractor.extract([
      "I prefer TypeScript.",
    ]);

    expect(generate).toHaveBeenCalledTimes(1);

    expect(result).toEqual([
      {
        content: "I prefer TypeScript.",
        type: "preference",
        confidence: 0.95,
        value: "TypeScript",
      },
    ]);
  });

  test("should extract multiple memories", async () => {
    const generate = mock(async () =>
      JSON.stringify([
        {
          content: "My name is Yogesh.",
          type: "identity",
          confidence: 0.99,
          value: "Yogesh",
        },
        {
          content: "I prefer TypeScript.",
          type: "preference",
          confidence: 0.95,
          value: "TypeScript",
        },
      ]),
    );

    const llm: LLMProvider = {
      generate,
    };

    const extractor = new LLMExtractor(llm);

    const result = await extractor.extract([
      "My name is Yogesh.",
      "I prefer TypeScript.",
    ]);

    expect(result).toHaveLength(2);

    expect(result[0]).toEqual({
      content: "My name is Yogesh.",
      type: "identity",
      confidence: 0.99,
      value: "Yogesh",
    });

    expect(result[1]).toEqual({
      content: "I prefer TypeScript.",
      type: "preference",
      confidence: 0.95,
      value: "TypeScript",
    });
  });

  test("should reject invalid JSON", async () => {
    const generate = mock(async () => "not valid json");

    const llm: LLMProvider = {
      generate,
    };

    const extractor = new LLMExtractor(llm);

    expect(
      extractor.extract(["I prefer TypeScript."]),
    ).rejects.toThrow();
  });

  test("should send sentences to the LLM", async () => {
    let receivedPrompt = "";

    const generate = mock(async (prompt: string) => {
      receivedPrompt = prompt;
      return "[]";
    });

    const llm: LLMProvider = {
      generate,
    };

    const extractor = new LLMExtractor(llm);

    await extractor.extract([
      "I prefer TypeScript.",
      "I am learning AI.",
    ]);

    expect(generate).toHaveBeenCalledTimes(1);

    expect(receivedPrompt).toContain(
      "I prefer TypeScript.",
    );

    expect(receivedPrompt).toContain(
      "I am learning AI.",
    );
  });
});
test("should reject invalid memory type", async () => {
  const llm: LLMProvider = {
    generate: mock(async () =>
      JSON.stringify([
        {
          content: "I prefer TypeScript.",
          type: "invalid-type",
          confidence: 0.95,
          value: "TypeScript",
        },
      ]),
    ),
  };

  const extractor = new LLMExtractor(llm);

  expect(
    extractor.extract(["I prefer TypeScript."]),
  ).rejects.toThrow();
});
test("should reject invalid confidence", async () => {
  const llm: LLMProvider = {
    generate: mock(async () =>
      JSON.stringify([
        {
          content: "I prefer TypeScript.",
          type: "preference",
          confidence: 2,
          value: "TypeScript",
        },
      ]),
    ),
  };

  const extractor = new LLMExtractor(llm);

  expect(
    extractor.extract(["I prefer TypeScript."]),
  ).rejects.toThrow();
});