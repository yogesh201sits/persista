import type {
  Entity,
  Relationship,
} from "../models";
import type { GraphStore } from "../interfaces";

export class InMemoryGraphStore
  implements GraphStore
{
  private readonly entities =
    new Map<string, Entity>();

  private readonly relationships =
    new Map<string, Relationship>();

  async upsertEntity(
    entity: Entity,
  ): Promise<void> {
    this.entities.set(
      entity.id,
      entity,
    );
  }

  async upsertRelationship(
    relationship: Relationship,
  ): Promise<void> {
    this.relationships.set(
      relationship.id,
      relationship,
    );
  }

  async getEntity(
    id: string,
  ): Promise<Entity | null> {
    return this.entities.get(id) ?? null;
  }

  async getRelationships(
    entityId: string,
  ): Promise<Relationship[]> {
    const results: Relationship[] = [];

    for (const relationship of this.relationships.values()) {
      if (
        relationship.sourceId === entityId ||
        relationship.targetId === entityId
      ) {
        results.push(relationship);
      }
    }

    return results;
  }

  async deleteEntity(
    id: string,
  ): Promise<void> {
    this.entities.delete(id);

    for (const [
      relationshipId,
      relationship,
    ] of this.relationships) {
      if (
        relationship.sourceId === id ||
        relationship.targetId === id
      ) {
        this.relationships.delete(
          relationshipId,
        );
      }
    }
  }

  async deleteRelationship(
    id: string,
  ): Promise<void> {
    this.relationships.delete(id);
  }

  async findEntity(
  name: string,
  type?: string,
): Promise<Entity | null> {
  for (const entity of this.entities.values()) {
    const nameMatches =
      entity.name.toLowerCase() ===
      name.toLowerCase();

    const typeMatches =
      !type ||
      entity.type.toLowerCase() ===
        type.toLowerCase();

    if (
      nameMatches &&
      typeMatches
    ) {
      return entity;
    }
  }

  return null;
}
async findRelationship(
  sourceId: string,
  targetId: string,
  type: string,
): Promise<Relationship | null> {
  for (const relationship of this.relationships.values()) {
    if (
      relationship.sourceId === sourceId &&
      relationship.targetId === targetId &&
      relationship.type.toLowerCase() ===
        type.toLowerCase()
    ) {
      return relationship;
    }
  }

  return null;
}
}
