import type { Entity, EntityExtraction } from "../models";

export interface EntityResolver {
  resolve(extraction: EntityExtraction): Promise<Entity>;
}
