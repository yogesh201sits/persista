export class PersistaError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);

    this.name = new.target.name;
  }
}