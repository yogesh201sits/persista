import type { Conversation } from "@persista/shared";
import type {
  VectorSearchFilter,
  VectorSearchResult,
} from "@persista/vector-store";

import type { PersistaClientOptions } from "../config";
import { PersistaSDKError } from "../errors";

import type {
  GraphSearchResult,
} from "@persista/graph";

export interface SearchOptions {
  limit?: number;
  minScore?: number;
  filter?: VectorSearchFilter[];
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

export interface GraphSearchOptions {
  depth?: number;
}

export class PersistaClient {
  readonly options: Required<PersistaClientOptions>;

  constructor(
    options: PersistaClientOptions = {},
  ) {
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
    const controller =
      new AbortController();

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
        throw new PersistaSDKError(
          data?.error?.message ??
            "Request failed.",
          response.status,
        );
      }

      return data as T;
    } catch (error) {
      if (
        error instanceof PersistaSDKError
      ) {
        throw error;
      }

      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        throw new PersistaSDKError(
          "Request timed out.",
        );
      }

      throw new PersistaSDKError(
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
    await this.request(
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
  ): Promise<VectorSearchResult[]> {
    const response =
      await this.request<{
        success: boolean;
        results: VectorSearchResult[];
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

    return response.results;
  }

  async update(
    memory: UpdateMemoryInput,
  ): Promise<void> {
    await this.request(
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
    await this.request(
      `/memories/${id}`,
      {
        method: "DELETE",
      },
    );
  }
  async graphSearch(
    entity: string,
    options?: GraphSearchOptions,
  ): Promise<GraphSearchResult | null> {
    const response =
      await this.request<{
        success: boolean;
        result: GraphSearchResult | null;
      }>(
        "/memories/graph/search",
        {
          method: "POST",
          body: JSON.stringify({
            entity,
            depth: options?.depth,
          }),
        },
      );

    return response.result;
  }
}