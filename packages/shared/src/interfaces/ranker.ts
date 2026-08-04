import type { Memory } from "../types";

export interface Ranker {
  rank(
    query: string,
    memories: Memory[],
  ): Promise<Memory[]>;
}