import { VectorSearchFilter } from "./vector-search";

export interface VectorSearchOptions {
  limit?: number;

  minScore?: number;

  filter?: VectorSearchFilter[];
}
