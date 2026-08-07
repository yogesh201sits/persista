import type { ExtractedMemory } from "../models";
import type { LLMProvider } from "../providers/llm-provider";
import type { ExtractorStrategy } from "./extractor-strategy";

export class LLMExtractor implements ExtractorStrategy {
  constructor(
    private readonly llm: LLMProvider,
  ) {}

  async extract(
    sentences: string[],
  ): Promise<ExtractedMemory[]> {
    if (sentences.length === 0) {
      return [];
    }

    const prompt = this.buildPrompt(sentences);

    const response = await this.llm.generate(prompt);

    return this.parseResponse(response);
  }

  private buildPrompt(sentences: string[]): string {
    return `
Extract meaningful memories from the following sentences.

Return ONLY valid JSON in this format:

[
  {
    "content": "original sentence",
    "type": "fact | identity | preference | goal | relationship",
    "confidence": 0.0,
    "value": "extracted value"
  }
]

Rules:
- Only extract information explicitly stated.
- Do not invent information.
- Confidence must be between 0 and 1.
- Ignore irrelevant sentences.

Sentences:
${sentences.join("\n")}
`;
  }

  private parseResponse(
    response: string,
  ): ExtractedMemory[] {
    const parsed: unknown = JSON.parse(response);

    if (!Array.isArray(parsed)) {
      throw new Error(
        "LLM extractor expected an array",
      );
    }

    return parsed as ExtractedMemory[];
  }
}