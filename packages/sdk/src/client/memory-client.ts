import type { MemoryClientOptions } from "../config";

export class MemoryClient {
  readonly options: Required<MemoryClientOptions>;

  constructor(options: MemoryClientOptions = {}) {
    this.options = {
      apiKey: options.apiKey ?? "",
      baseUrl: options.baseUrl ?? "http://localhost:3000",
      timeout: options.timeout ?? 30_000,
      headers: options.headers ?? {},
    };
  }
}