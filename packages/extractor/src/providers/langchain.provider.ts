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

  async extractMemories(
    sentences: string[],
  ): Promise<ExtractedMemory[]> {
    const structuredModel =
      this.model.withStructuredOutput(
        extractedMemoriesSchema,
      );

    const prompt = ChatPromptTemplate.fromTemplate(`
Extract meaningful memories from the following sentences.

Rules:
- Only extract information explicitly stated.
- Do not invent information.
- Ignore irrelevant information.
- Confidence must be between 0 and 1.
- Return the original sentence in "content".
- Use "value" for the main extracted value when applicable.

Sentences:
{sentences}
`);

    const messages = await prompt.formatMessages({
      sentences: sentences.join("\n"),
    });

    return await structuredModel.invoke(messages);
  }
}