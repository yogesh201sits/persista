import type { PersistaClientOptions } from "../config";
import { MemorySDKError } from "../errors";

export class PersistaClient {
  readonly options: Required<PersistaClientOptions>;

  constructor(options: PersistaClientOptions = {}) {
    this.options = {
      apiKey: options.apiKey ?? "",
      baseUrl:
        options.baseUrl ?? "http://localhost:3000",
      timeout: options.timeout ?? 30_000,
      headers: options.headers ?? {},
    };
  }

  private async request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, this.options.timeout);

    try {
      const response = await fetch(
        `${this.options.baseUrl}${path}`,
        {
          ...options,
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            ...this.options.headers,
            ...(this.options.apiKey
              ? {
                  Authorization: `Bearer ${this.options.apiKey}`,
                }
              : {}),
            ...options.headers,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new MemorySDKError(
          data?.error?.message ??
            "Request failed.",
          response.status,
        );
      }

      return data as T;
    } catch (error) {
      if (error instanceof MemorySDKError) {
        throw error;
      }

      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        throw new MemorySDKError(
          "Request timed out.",
        );
      }

      throw new MemorySDKError(
        error instanceof Error
          ? error.message
          : "Request failed.",
      );
    } finally {
      clearTimeout(timeout);
    }
  }
}