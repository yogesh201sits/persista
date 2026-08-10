import type {
  GraphSearchResult,
} from "@persista/graph";

import type {
  VectorSearchResult,
} from "@persista/vector-store";

export interface GraphMatch {
  entityId: string;
  depth: number;
  confidence: number;
}

export function findGraphMatches(
  vectorResult: VectorSearchResult,
  graphResult: GraphSearchResult,
): GraphMatch[] {
  const content =
    vectorResult.metadata!.content.toLowerCase();

  const matches: GraphMatch[] = [];

  if (
    content.includes(
      graphResult.entity.name.toLowerCase(),
    )
  ) {
    matches.push({
      entityId:
        graphResult.entity.id,
      depth: 0,
      confidence: 1,
    });
  }

  for (const item of graphResult.relationships) {
    if (
      content.includes(
        item.entity.name.toLowerCase(),
      )
    ) {
      matches.push({
        entityId:
          item.entity.id,
        depth: item.depth,
        confidence:
          item.relationship.confidence,
      });
    }
  }

  return matches;
}