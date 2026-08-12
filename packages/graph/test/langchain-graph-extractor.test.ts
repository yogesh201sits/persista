import { describe, expect, it } from "bun:test";

import { LangChainGraphExtractor } from "../src";

import type { Conversation } from "@persista/shared";

describe("LangChainGraphExtractor", () => {
  it("should extract entities and relationships", async () => {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      throw new Error("GROQ_API_KEY is required");
    }

    const extractor = new LangChainGraphExtractor(apiKey);

    const conversation: Conversation = {
      messages: [
        {
          role: "user",
          content:
            "My name is Yogesh. I prefer Bun and TypeScript. I am building Persista.",
        },
      ],
    };

    const result = await extractor.extract(conversation);

    console.log(JSON.stringify(result, null, 2));

    expect(result.entities.length).toBeGreaterThan(0);

    expect(result.relationships.length).toBeGreaterThan(0);
  });
});
