import { ChatGroq } from "@langchain/groq";
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

  async generate(prompt: string): Promise<string> {
    const response = await this.model.invoke(prompt);

    if (typeof response.content !== "string") {
      throw new Error(
        "LangChain model returned non-string content",
      );
    }

    return response.content;
  }
}