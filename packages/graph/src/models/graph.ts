export interface GraphEntity {
  id: string;
  name: string;
  type: string;
  metadata?: Record<string, unknown>;
}

export interface GraphRelationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: string;
  confidence: number;
  metadata?: Record<string, unknown>;
}

export interface GraphRelationshipResult {
  relationship: GraphRelationship;
  entity: GraphEntity;
  depth: number;
}

export interface GraphSearchResult {
  entity: GraphEntity;
  relationships: GraphRelationshipResult[];
}