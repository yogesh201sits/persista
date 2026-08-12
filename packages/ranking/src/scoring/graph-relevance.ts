import type { GraphSearchResult } from "@persista/graph";

import type { GraphMatch } from "./graph-match";

export function calculateGraphRelevance(result: GraphSearchResult): number {
  if (result.relationships.length === 0) {
    return 1;
  }

  let score = 0;

  for (const relationship of result.relationships) {
    score += relationship.relationship.confidence * (1 / relationship.depth);
  }

  return Math.min(score, 1);
}

export function calculateMatchRelevance(matches: GraphMatch[]): number {
  if (matches.length === 0) {
    return 0;
  }

  let score = 0;

  for (const match of matches) {
    const depthFactor = match.depth === 0 ? 1 : 1 / match.depth;

    score += match.confidence * depthFactor;
  }

  return Math.min(score, 1);
}
