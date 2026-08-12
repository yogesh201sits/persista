import type { Entity, EntityExtraction } from "../models";

import type { GraphStore } from "../interfaces";

import type { EntityResolver } from "../interfaces";

export class DefaultEntityResolver implements EntityResolver {
  constructor(private readonly graphStore: GraphStore) {}

  async resolve(extraction: EntityExtraction): Promise<Entity> {
    const existing = await this.graphStore.findEntity(
      extraction.name,
      extraction.type,
    );

    if (existing) {
      return existing;
    }

    const entity: Entity = {
      id: crypto.randomUUID(),
      name: extraction.name,
      type: extraction.type,
      metadata: {
        confidence: extraction.confidence,
      },
    };

    await this.graphStore.upsertEntity(entity);

    return entity;
  }
}
