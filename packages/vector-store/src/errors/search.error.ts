import { VectorStoreError } from "./vector-store.error";

export class SearchError extends VectorStoreError {
  constructor(message = "Vector search failed.") {
    super(message);

    this.name = "SearchError";
  }
}