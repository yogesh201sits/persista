import { describe, expect, test, mock } from "bun:test";

import { PersistaClient } from "../src";

import { PersistaSDKError } from "../src";

describe("PersistaClient", () => {
  test("uses default options", () => {
    const client = new PersistaClient();

    expect(client.options).toEqual({
      apiKey: "",
      baseUrl: "http://localhost:3000",
      timeout: 30_000,
      headers: {},
    });
  });

  test("uses custom options", () => {
    const client = new PersistaClient({
      apiKey: "test-key",
      baseUrl: "https://api.example.com",
      timeout: 5_000,
      headers: {
        "X-Test": "true",
      },
    });

    expect(client.options).toEqual({
      apiKey: "test-key",
      baseUrl: "https://api.example.com",
      timeout: 5_000,
      headers: {
        "X-Test": "true",
      },
    });
  });
});
const originalFetch = globalThis.fetch;

globalThis.fetch = (async (
  input: RequestInfo | URL,
  init?: RequestInit,
) => {
  expect(input).toBe(
    "http://localhost:3000/memories",
  );

  expect(init?.method).toBe("POST");

  expect(init?.headers).toEqual({
    "Content-Type": "application/json",
    Authorization: "Bearer test-key",
  });

  expect(init?.body).toBe(
    JSON.stringify({
      conversation: {
        messages: [],
      },
    }),
  );

  return new Response(
    JSON.stringify({}),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}) as typeof fetch;

test("sends a remember request", async () => {
  const fetchMock = mock(
    async (
      input: RequestInfo | URL,
      init?: RequestInit,
    ) => {
      expect(input).toBe(
        "http://localhost:3000/memories",
      );

      expect(init?.method).toBe("POST");

      expect(init?.headers).toEqual({
        "Content-Type": "application/json",
        Authorization: "Bearer test-key",
      });

      expect(init?.body).toBe(
        JSON.stringify({
          conversation: {
            messages: [],
          },
        }),
      );

      return new Response(
        JSON.stringify({}),
        {
          status: 200,
        },
      );
    },
  );

  globalThis.fetch =
    fetchMock as unknown as typeof fetch;

  try {
    const client = new PersistaClient({
      apiKey: "test-key",
    });

    await client.remember({
      messages: [],
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  } finally {
    globalThis.fetch = fetch;
  }
});

test("throws PersistaSDKError for failed requests", async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async () => {
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Request validation failed.",
        },
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }) as unknown as typeof fetch;

  try {
    const client = new PersistaClient();

    await expect(
      client.remember({
        messages: [],
      }),
    ).rejects.toBeInstanceOf(PersistaSDKError);

    try {
      await client.remember({
        messages: [],
      });
    } catch (error) {
      expect(error).toBeInstanceOf(PersistaSDKError);

      const sdkError = error as PersistaSDKError;

      expect(sdkError.message).toBe(
        "Request validation failed.",
      );

      expect(sdkError.statusCode).toBe(400);
    }
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("sends a search request and returns results", async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ) => {
    expect(input).toBe(
      "http://localhost:3000/memories/search",
    );

    expect(init?.method).toBe("POST");

    expect(init?.headers).toEqual({
      "Content-Type": "application/json",
    });

    expect(init?.body).toBe(
      JSON.stringify({
        query: "TypeScript",
        limit: 5,
        minScore: 0.7,
        filter: {
          type: "preference",
        },
      }),
    );

    return new Response(
      JSON.stringify({
        data: [
          {
            id: "memory-1",
            score: 0.92,
            metadata: {
              content: "I prefer TypeScript",
              type: "preference",
              confidence: 0.98,
              value: "TypeScript",
              createdAt: "2026-08-09T10:00:00.000Z",
            },
          },
        ],
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }) as typeof fetch;

  try {
    const client = new PersistaClient();

    const results = await client.search(
      "TypeScript",
      {
        limit: 5,
        minScore: 0.7,
        filter: {
          type: "preference",
        },
      },
    );

    expect(results).toEqual([
      {
        id: "memory-1",
        score: 0.92,
        metadata: {
          content: "I prefer TypeScript",
          type: "preference",
          confidence: 0.98,
          value: "TypeScript",
          createdAt: "2026-08-09T10:00:00.000Z",
        },
      },
    ]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("sends an update request", async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ) => {
    expect(input).toBe(
      "http://localhost:3000/memories/memory-1",
    );

    expect(init?.method).toBe("PUT");

    expect(init?.headers).toEqual({
      "Content-Type": "application/json",
    });

    expect(init?.body).toBe(
      JSON.stringify({
        content: "I prefer Bun",
        type: "preference",
        confidence: 1,
        value: "Bun",
      }),
    );

    return new Response(
      JSON.stringify({}),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }) as typeof fetch;

  try {
    const client = new PersistaClient();

    await client.update({
      id: "memory-1",
      content: "I prefer Bun",
      type: "preference",
      confidence: 1,
      value: "Bun",
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("sends a delete request", async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ) => {
    expect(input).toBe(
      "http://localhost:3000/memories/memory-1",
    );

    expect(init?.method).toBe("DELETE");

    expect(init?.headers).toEqual({
      "Content-Type": "application/json",
    });

    expect(init?.body).toBeUndefined();

    return new Response(
      JSON.stringify({}),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }) as typeof fetch;

  try {
    const client = new PersistaClient();

    await client.delete("memory-1");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("sends api key and custom headers", async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ) => {
    expect(input).toBe(
      "https://api.example.com/memories",
    );

    expect(init?.headers).toEqual({
      "Content-Type": "application/json",
      "X-Client-Version": "0.1.0",
      Authorization: "Bearer test-key",
    });

    return new Response(
      JSON.stringify({}),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }) as typeof fetch;

  try {
    const client = new PersistaClient({
      baseUrl: "https://api.example.com",
      apiKey: "test-key",
      headers: {
        "X-Client-Version": "0.1.0",
      },
    });

    await client.remember({
      messages: [],
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});