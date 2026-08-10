import { ChatGroq } from "@langchain/groq";
import { z } from "zod";

const queryAnalysisSchema =
  z.object({
    entities: z.array(
      z.string(),
    ),
  });

export interface QueryAnalyzerInterface {
  analyze(
    query: string,
  ): Promise<QueryAnalysis>;
}

export interface QueryAnalysis {
  entities: string[];
}

export class QueryAnalyzer implements QueryAnalyzerInterface {
  private readonly llm;

  constructor(
    apiKey: string,
    model = "llama-3.3-70b-versatile",
  ) {
    this.llm = new ChatGroq({
      apiKey,
      model,
      temperature: 0,
    });
  }

  async analyze(
    query: string,
  ): Promise<QueryAnalysis> {
    const structuredLlm =
      this.llm.withStructuredOutput(
        queryAnalysisSchema,
      );

    const result =
      await structuredLlm.invoke([
        {
          role: "system",
          content: `
You are a query analyzer for a
hybrid memory retrieval system.

Your job is to identify important
named entities from the user's query
that may exist in a knowledge graph.

Extract:
- projects
- technologies
- people
- organizations
- products
- companies
- other explicitly named entities

Rules:
- Do not invent entities.
- Only extract entities explicitly
  mentioned or clearly identifiable
  in the query.
- Return an empty array when there
  are no graph entities.
          `,
        },
        {
          role: "user",
          content: query,
        },
      ]);

    return {
      entities:
        result.entities.map(
          (entity) =>
            entity.trim(),
        ),
    };
  }
}
