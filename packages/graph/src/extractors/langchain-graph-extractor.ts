import {
  ChatGroq,
} from "@langchain/groq";

import {
  ChatPromptTemplate,
} from "@langchain/core/prompts";

import type { Conversation } from "@persista/shared";

import type {
  GraphExtractor,
} from "../interfaces";

import type {
  GraphExtractionResult,
} from "../models";

import { graphExtractionSchema } from "../schema"

export class LangChainGraphExtractor
  implements GraphExtractor
{
  private readonly model;

  private readonly prompt;

  constructor(
    apiKey: string,
  ) {
    this.model = new ChatGroq({
      apiKey,
      model:
        "llama-3.3-70b-versatile",
      temperature: 0,
    });

    this.prompt =
      ChatPromptTemplate.fromMessages([
        [
          "system",
          `
You are a graph memory extraction system.

Extract meaningful entities and
relationships from the conversation.

Entities represent important people,
organizations, technologies, projects,
places, concepts, or other meaningful
things.

Relationships describe meaningful
connections between entities.

Rules:

- Only extract information explicitly
  stated or strongly implied.
- Do not invent entities.
- Do not invent relationships.
- Use concise entity names.
- Use consistent relationship types.
- Relationship source and target must
  exactly match entity names.
- Confidence must be between 0 and 1.
- Ignore irrelevant conversational text.
`,
        ],
        [
          "human",
          "Conversation:\\n{conversation}",
        ],
      ]);
  }

  async extract(
    conversation: Conversation,
  ): Promise<GraphExtractionResult> {
    const structuredModel =
      this.model.withStructuredOutput(
        graphExtractionSchema,
      );

    const chain =
      this.prompt.pipe(
        structuredModel,
      );

    const result =
      await chain.invoke({
        conversation:
          JSON.stringify(conversation),
      });

    return result;
  }
}