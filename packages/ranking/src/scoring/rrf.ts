export interface RRFItem {
  id: string;
  rank: number;
}

export interface RRFOptions {
  k?: number;
}

export function calculateRRFScore(
  ranks: RRFItem[],
  options?: RRFOptions,
): number {
  const k = options?.k ?? 60;

  let score = 0;

  for (const item of ranks) {
    score += 1 / (k + item.rank);
  }

  return score;
}
