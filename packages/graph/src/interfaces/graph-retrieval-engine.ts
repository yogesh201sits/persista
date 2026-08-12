import type { GraphRetrievalResult } from "../models";

export interface GraphRetrievalEngine {
  search(
    entityName: string,
    depth?: number,
  ): Promise<GraphRetrievalResult | null>;
}
