export class VectorStoreError extends Error {
  constructor(message: string) {
    super(message);

    this.name = "VectorStoreError";
  }
}