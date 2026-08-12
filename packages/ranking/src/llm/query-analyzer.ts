import { ChatGroq } from "@langchain/groq";
import { z } from "zod";

const queryAnalysisSchema = z.object({
  entities: z.array(z.string()),
});

export interface QueryAnalyzerInterface {
  analyze(query: string): Promise<QueryAnalysis>;
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

  async analyze(query: string): Promise<QueryAnalysis> {
    const structuredLlm =
      this.llm.withStructuredOutput(
        queryAnalysisSchema,
      );

    const result = await structuredLlm.invoke([
      {
        role: "system",
        content: `
You are an entity extractor for a graph-based
memory retrieval system.

Your job is to identify entities, concepts,
objects, topics, and meaningful terms from the
user's query that may exist in a knowledge graph.

Extract:
- people
- projects
- technologies
- organizations
- products
- companies
- places
- preferences
- topics
- objects
- foods
- activities
- other meaningful concepts explicitly
  mentioned in the query

Examples:

Query:
"What technologies does CodePilot use?"

Entities:
["CodePilot"]

Query:
"What do I like, tea or coffee?"

Entities:
["tea", "coffee"]

Query:
"What programming languages do I know?"

Entities:
["programming languages"]

Query:
"What projects have I worked on?"

Entities:
["projects"]

Rules:
- Do not invent entities.
- Only extract terms explicitly mentioned
  or clearly identifiable from the query.
- Prefer the original wording from the query.
- Extract multiple entities when multiple
  meaningful graph-searchable terms exist.
- Do not return generic filler words.
- Return an empty array when there is nothing
  meaningful to search in the graph.
        `,
      },
      {
        role: "user",
        content: query,
      },
    ]);

    return {
      entities: result.entities.map(
        (entity) => entity.trim(),
      ),
    };
  }
}
