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