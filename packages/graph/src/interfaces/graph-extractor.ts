import type { Conversation } from "@persista/shared";

import type {
  GraphExtractionResult,
} from "../models";

export interface GraphExtractor {
  extract(
    conversation: Conversation,
  ): Promise<GraphExtractionResult>;
}