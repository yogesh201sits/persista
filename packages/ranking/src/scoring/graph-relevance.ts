import type { GraphSearchResult } from "@persista/graph";

export function calculateGraphRelevance(
  result: GraphSearchResult,
): number {
  if (result.relationships.length === 0) {
    return 1;
  }

  let score = 0;

  for (const item of result.relationships) {
    const confidence =
      item.relationship.confidence;

    const depthFactor =
      1 / item.depth;

    score +=
      confidence * depthFactor;
  }

  return Math.min(score, 1);
}