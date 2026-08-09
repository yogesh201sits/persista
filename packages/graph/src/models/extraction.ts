export interface EntityExtraction {
  name: string;

  type: string;

  confidence: number;
}

export interface RelationshipExtraction {
  source: string;

  target: string;

  type: string;

  confidence: number;
}

export interface GraphExtractionResult {
  entities: EntityExtraction[];

  relationships: RelationshipExtraction[];
}