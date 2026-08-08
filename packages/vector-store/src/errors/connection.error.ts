import { VectorStoreError } from "./vector-store.error";

export class ConnectionError extends VectorStoreError {
  constructor(message = "Unable to connect to the vector store.") {
    super(message);

    this.name = "ConnectionError";
  }
}
