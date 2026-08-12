import type { GraphRetrievalEngine, GraphStore } from "../interfaces";

import type { GraphRetrievalResult } from "../models";

import { Entity, Relationship } from "../models";

import type { QueryAnalyzer } from "@persista/ranking";

export class DefaultGraphRetrievalEngine
  implements GraphRetrievalEngine {
  constructor(
    private readonly graphStore: GraphStore,
    private readonly queryAnalyzer?: QueryAnalyzer,
  ) { }

  async search(
    entityName: string,
    depth = 1,
  ): Promise<GraphRetrievalResult | null> {
    const entity =
      await this.graphStore.findEntity(entityName);

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

    let currentEntityIds = new Set<string>([
      entity.id,
    ]);

    for (
      let currentDepth = 1;
      currentDepth <= depth;
      currentDepth++
    ) {
      const nextEntityIds = new Set<string>();

      for (const currentEntityId of currentEntityIds) {
        const currentRelationships =
          await this.graphStore.getRelationships(
            currentEntityId,
          );

        for (const relationship of currentRelationships) {
          const relatedEntityId =
            relationship.sourceId === currentEntityId
              ? relationship.targetId
              : relationship.sourceId;

          if (visited.has(relatedEntityId)) {
            continue;
          }

          const relatedEntity =
            await this.graphStore.getEntity(
              relatedEntityId,
            );

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

  async searchQuery(
    query: string,
    depth = 1,
  ): Promise<GraphRetrievalResult | null> {
    if (!this.queryAnalyzer) {
      throw new Error(
        "QueryAnalyzer is required for searchQuery().",
      );
    }

    const analysis =
      await this.queryAnalyzer.analyze(query);

    if (analysis.entities.length === 0) {
      return null;
    }

    const results: GraphRetrievalResult[] = [];

    for (const entityName of analysis.entities) {
      const result = await this.search(
        entityName,
        depth,
      );

      if (result) {
        results.push(result);
      }
    }

    if (results.length === 0) {
      return null;
    }

    /*
     * For now, return the first root entity
     * and merge all relationships.
     */

    const firstResult = results[0];

    return {
      entity: firstResult.entity,

      relationships: results.flatMap(
        (result) => result.relationships,
      ),
    };
  }
}