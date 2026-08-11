export interface HybridScoreOptions {
  vectorWeight: number;
  graphWeight: number;
}

export function calculateHybridScore(
  vectorScore: number,
  graphScore: number,
  options: HybridScoreOptions,
): number {
  const totalWeight =
    options.vectorWeight +
    options.graphWeight;

  if (totalWeight <= 0) {
    throw new Error(
      "Hybrid weights must be greater than zero.",
    );
  }

  const normalizedVectorWeight =
    options.vectorWeight / totalWeight;

  const normalizedGraphWeight =
    options.graphWeight / totalWeight;

  return (
    vectorScore *
      normalizedVectorWeight +
    graphScore *
      normalizedGraphWeight
  );
}