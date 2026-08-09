import type { PersistaClientOptions } from "../config";
import { MemorySDKError } from "../errors";
import type { Conversation } from "@persista/shared";

export interface SearchOptions {
  limit?: number;
  minScore?: number;
  filter?: Record<string, unknown>;
}

export interface SearchResult {
  id: string;
  score: number;
  metadata: {
    content: string;
    type:
      | "fact"
      | "identity"
      | "preference"
      | "goal"
      | "relationship";
    confidence: number;
    value?: string;
    createdAt: string;
    [key: string]: unknown;
  };
}

export interface UpdateMemoryInput {
  id: string;
  content: string;
  type:
    | "fact"
    | "identity"
    | "preference"
    | "goal"
    | "relationship";
  confidence: number;
  value?: string;
}

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

  async remember(
    conversation: Conversation,
  ): Promise<void> {
    await this.request<void>(
      "/memories",
      {
        method: "POST",
        body: JSON.stringify({
          conversation,
        }),
      },
    );
  }

  async search(
    query: string,
    options?: SearchOptions,
  ): Promise<SearchResult[]> {
    const params = new URLSearchParams();

    params.set("query", query);

    if (options?.limit !== undefined) {
      params.set(
        "limit",
        String(options.limit),
      );
    }

    if (options?.minScore !== undefined) {
      params.set(
        "minScore",
        String(options.minScore),
      );
    }

    if (options?.filter !== undefined) {
      params.set(
        "filter",
        JSON.stringify(options.filter),
      );
    }

    // const response = await this.request<{
    //   data: SearchResult[];
    // }>(
    //   `/memories/search?${params.toString()}`,
    //   {
    //     method: "GET",
    //   },
    // );

    // return response.data;
    const response = await this.request<{
    data: SearchResult[];
  }>(
    "/memories/search",
    {
      method: "POST",
      body: JSON.stringify({
        query,
        limit: options?.limit,
        minScore: options?.minScore,
        filter: options?.filter,
      }),
    },
  );

  return response.data;
  }

  async update(
    memory: UpdateMemoryInput,
  ): Promise<void> {
    await this.request<void>(
      `/memories/${memory.id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          content: memory.content,
          type: memory.type,
          confidence: memory.confidence,
          value: memory.value,
        }),
      },
    );
  }

  async delete(
    id: string,
  ): Promise<void> {
    await this.request<void>(
      `/memories/${id}`,
      {
        method: "DELETE",
      },
    );
  }

}