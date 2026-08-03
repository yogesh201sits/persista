import { PersistaError } from "./base";

export class ProviderError extends PersistaError {
  constructor(message: string) {
    super(message, "PROVIDER_ERROR");
  }
}