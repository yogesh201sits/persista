import type { Conversation } from "@persista/shared";

import type {
  EntityResolver,
  GraphExtractor,
  GraphMemory,
  GraphStore,
} from "../interfaces";

export class GraphMemoryManager implements GraphMemory {
  constructor(
    private readonly extractor: GraphExtractor,
    private readonly entityResolver: EntityResolver,
    private readonly graphStore: GraphStore,
  ) {}

  async remember(conversation: Conversation): Promise<void> {
    const result = await this.extractor.extract(conversation);

    const entityIds = new Map<string, string>();

    for (const extraction of result.entities) {
      const entity = await this.entityResolver.resolve(extraction);

      entityIds.set(extraction.name.toLowerCase(), entity.id);
    }

    for (const extraction of result.relationships) {
      const sourceId = entityIds.get(extraction.source.toLowerCase());

      const targetId = entityIds.get(extraction.target.toLowerCase());

      if (!sourceId || !targetId) {
        continue;
      }

      const existing = await this.graphStore.findRelationship(
        sourceId,
        targetId,
        extraction.type,
      );

      if (existing) {
        continue;
      }

      await this.graphStore.upsertRelationship({
        id: crypto.randomUUID(),
        sourceId,
        targetId,
        type: extraction.type,
        confidence: extraction.confidence,
      });
    }
  }
}
