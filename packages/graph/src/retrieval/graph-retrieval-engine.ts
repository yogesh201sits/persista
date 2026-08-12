import type { GraphRetrievalEngine, GraphStore } from "../interfaces";

import type { GraphRetrievalResult } from "../models";

import { Relationship } from "../models";

import { Entity } from "../models";

export class DefaultGraphRetrievalEngine implements GraphRetrievalEngine {
  constructor(private readonly graphStore: GraphStore) {}

  async search(
    entityName: string,
    depth = 1,
  ): Promise<GraphRetrievalResult | null> {
    const entity = await this.graphStore.findEntity(entityName);

    if (!entity) {
      return null;
    }

    const relationships: Array<{
      relationship: Relationship;
      entity: Entity;
      depth: number;
    }> = [];

    const visited = new Set<string>();

    visited.add(entity.id);

    let currentEntityIds = new Set<string>([entity.id]);

    for (let currentDepth = 1; currentDepth <= depth; currentDepth++) {
      const nextEntityIds = new Set<string>();

      for (const currentEntityId of currentEntityIds) {
        const currentRelationships =
          await this.graphStore.getRelationships(currentEntityId);

        for (const relationship of currentRelationships) {
          const relatedEntityId =
            relationship.sourceId === currentEntityId
              ? relationship.targetId
              : relationship.sourceId;

          if (visited.has(relatedEntityId)) {
            continue;
          }

          const relatedEntity =
            await this.graphStore.getEntity(relatedEntityId);

          if (!relatedEntity) {
            continue;
          }

          visited.add(relatedEntityId);

          nextEntityIds.add(relatedEntityId);

          relationships.push({
            relationship,
            entity: relatedEntity,
            depth: currentDepth,
          });
        }
      }

      currentEntityIds = nextEntityIds;
    }

    return {
      entity,
      relationships,
    };
  }
}
