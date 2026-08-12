export interface LLMClient {
  generate(prompt: string): Promise<string>;
}
