import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import type { ExtractedMemory } from "../models";
import { extractedMemoriesSchema } from "../schemas/extracted-memory.schema";
import type { LLMProvider } from "./llm-provider";

export interface LangChainProviderOptions {
  apiKey: string;
  model: string;
}

export class LangChainProvider implements LLMProvider {
  private readonly model: ChatGroq;

  constructor(options: LangChainProviderOptions) {
    this.model = new ChatGroq({
      apiKey: options.apiKey,
      model: options.model,
    });
  }

  async extractMemories(sentences: string[]): Promise<ExtractedMemory[]> {
    if (sentences.length === 0) {
      return [];
    }

    const structuredModel = this.model.withStructuredOutput(
      extractedMemoriesSchema,
    );

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `
You are a memory extraction system.

Extract useful persistent memories from the user's conversation.

Rules:
- Only extract information explicitly stated.
- Do not invent information.
- Ignore irrelevant information.
- A sentence may produce multiple memories.
- Confidence must be between 0 and 1.
- "content" must contain the original statement.
- "value" should contain the main extracted value.
- Return all memories inside the "memories" field.
- If there are no meaningful memories, return an empty "memories" array.
        `,
      ],
      [
        "human",
        `
Extract memories from these sentences:

{sentences}
        `,
      ],
    ]);

    const messages = await prompt.formatMessages({
      sentences: sentences.join("\n"),
    });

    const result = await structuredModel.invoke(messages);

    return result.memories;
  }
}
