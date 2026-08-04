import { PersistaError } from "./base";

export class DatabaseError extends PersistaError {
  constructor(message: string) {
    super(message, "DATABASE_ERROR");
  }
}