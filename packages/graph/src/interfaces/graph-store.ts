import type { Entity, Relationship } from "../models";

export interface GraphStore {
  upsertEntity(entity: Entity): Promise<void>;

  upsertRelationship(relationship: Relationship): Promise<void>;

  getEntity(id: string): Promise<Entity | null>;

  getRelationships(entityId: string): Promise<Relationship[]>;

  deleteEntity(id: string): Promise<void>;

  deleteRelationship(id: string): Promise<void>;
}
