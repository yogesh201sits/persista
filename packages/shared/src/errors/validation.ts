import { PersistaError } from "./base";

export class ValidationError extends PersistaError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR");
  }
}