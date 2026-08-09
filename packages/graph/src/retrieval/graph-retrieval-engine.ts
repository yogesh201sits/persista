import type {
  GraphRetrievalEngine,
  GraphStore,
} from "../interfaces";

import type {
  GraphRetrievalResult,
} from "../models";

export class DefaultGraphRetrievalEngine
  implements GraphRetrievalEngine
{
  constructor(
    private readonly graphStore: GraphStore,
  ) {}

  async search(
    entityName: string,
  ): Promise<GraphRetrievalResult | null> {
    const entity =
      await this.graphStore.findEntity(
        entityName,
      );

    if (!entity) {
      return null;
    }

    const relationships =
      await this.graphStore.getRelationships(
        entity.id,
      );

    const results: Array<{
      relationship: typeof relationships[number];
      entity: NonNullable<
        Awaited<
          ReturnType<
            GraphStore["getEntity"]
          >
        >
      >;
    }> = [];

    for (
      const relationship of relationships
    ) {
      const relatedEntity =
        await this.graphStore.getEntity(
          relationship.targetId,
        );

      if (!relatedEntity) {
        continue;
      }

      results.push({
        relationship,
        entity: relatedEntity,
      });
    }

    return {
      entity,
      relationships: results,
    };
  }
}