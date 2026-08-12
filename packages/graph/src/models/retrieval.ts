import type { Entity, Relationship } from "./index";

export interface GraphRetrievalResult {
  entity: Entity;

  relationships: Array<{
    relationship: Relationship;
    entity: Entity;
    depth: number;
  }>;
}
