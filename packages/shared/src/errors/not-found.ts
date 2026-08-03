import { PersistaError } from "./base";

export class NotFoundError extends PersistaError {
  constructor(resource: string) {
    super(`${resource} not found`, "NOT_FOUND");
  }
}