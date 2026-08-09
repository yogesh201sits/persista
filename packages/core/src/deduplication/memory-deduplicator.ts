import type {
  VectorSearchResult,
} from "@persista/vector-store";

export interface MemoryDeduplicator {
  isDuplicate(
    results: VectorSearchResult[],
  ): boolean;
}

export interface MemoryDeduplicatorOptions {
  threshold?: number;
}

export class DefaultMemoryDeduplicator
  implements MemoryDeduplicator
{
  private readonly threshold: number;

  constructor(
    options: MemoryDeduplicatorOptions = {},
  ) {
    this.threshold =
      options.threshold ?? 0.95;
  }

  isDuplicate(
    results: VectorSearchResult[],
  ): boolean {
    return results.some(
      (result) =>
        result.score >= this.threshold,
    );
  }
}