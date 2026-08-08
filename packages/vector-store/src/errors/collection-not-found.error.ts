import { VectorStoreError } from "./vector-store.error";

export class CollectionNotFoundError extends VectorStoreError {
  constructor(collection: string) {
    super(`Collection "${collection}" was not found.`);

    this.name = "CollectionNotFoundError";
  }
}
