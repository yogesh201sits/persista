import type { LLMClient } from "./llm-client";

export interface QueryAnalysis {
  entities: string[];
}

export class QueryAnalyzer {
  constructor(
    private readonly llm: LLMClient,
  ) {}

  async analyze(
    query: string,
  ): Promise<QueryAnalysis> {
    const prompt = `
Extract the important entities from this
user query for graph retrieval.

Return ONLY valid JSON.

Format:
{
  "entities": ["entity1", "entity2"]
}

Query:
${query}
`;

    const response =
      await this.llm.generate(prompt);

    return JSON.parse(response);
  }
}