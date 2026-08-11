# Persista SDK

The Persista SDK provides a TypeScript interface for interacting with Persista memory infrastructure.

It allows applications to store conversations, retrieve relevant memories, update existing memories, and delete memories without directly interacting with the Persista HTTP API.

---

## Initialize the Client

```ts
import { PersistaClient } from "@persista/sdk";

const client = new PersistaClient({
  baseUrl: "http://localhost:3000",
});
```

The `baseUrl` points to the Persista API server.

---

# Remember

Use `remember()` to store information from a conversation.

```ts
await client.remember({
  conversation: {
    messages: [
      {
        role: "user",
        content:
          "I prefer React and TypeScript for frontend development.",
      },
    ],
  },
});
```

Persista processes the conversation and extracts useful memories.

For example:

```text
Preference:
"I prefer React and TypeScript for frontend development."
```

The extracted memory can then be used by future searches.

---

# Search

Use `search()` to retrieve relevant memories.

```ts
const result = await client.search({
  query: "What frontend technologies do I prefer?",
});
```

Example result:

```ts
{
  query: "What frontend technologies do I prefer?",
  results: [
    {
      id: "memory-id",
      score: 0.82,
      sources: ["vector"],
      memory: {
        id: "memory-id",
        score: 0.82,
        metadata: {
          content: "I prefer React and TypeScript for frontend development",
          type: "preference",
          confidence: 1,
          createdAt: "2026-08-10T06:13:39.866Z"
        }
      }
    }
  ]
}
```

---

# Hybrid Search

Persista can combine semantic vector retrieval with graph retrieval.

```ts
const result = await client.search({
  query: "What technologies does CodePilot use?",
  limit: 10,
  graphDepth: 2,
});
```

A result can contain information from both retrieval sources:

```ts
{
  id: "memory-id",
  score: 0.032,
  sources: ["vector", "graph"]
}
```

The `sources` field indicates which retrieval systems contributed to the result.

Possible values are:

```ts
"vector"
"graph"
```

or both:

```ts
["vector", "graph"]
```

Hybrid retrieval is handled by Persista internally. Applications do not need to manually call the vector and graph retrieval systems.

---

# Search Options

Search accepts optional retrieval parameters.

```ts
const result = await client.search({
  query: "What technologies does CodePilot use?",
  limit: 10,
  minScore: 0.5,
  graphDepth: 2,
});
```

### `query`

The natural-language query.

```ts
query: "What technologies does CodePilot use?"
```

Required.

### `limit`

Maximum number of results returned.

```ts
limit: 10
```

Defaults to `10`.

### `minScore`

Minimum vector similarity score.

```ts
minScore: 0.5
```

Optional.

### `graphDepth`

Maximum graph traversal depth.

```ts
graphDepth: 2
```

A depth of `1` retrieves directly related entities.

A larger depth allows deeper relationships to participate in retrieval.

---

# Update Memory

Update an existing memory using its ID.

```ts
await client.updateMemory({
  id: "memory-id",
  content: "I prefer React for frontend development.",
  type: "preference",
  confidence: 1,
});
```

Supported memory types include:

```ts
type MemoryType =
  | "fact"
  | "identity"
  | "preference"
  | "goal"
  | "relationship";
```

An optional value can also be provided:

```ts
await client.updateMemory({
  id: "memory-id",
  content: "CodePilot uses React",
  type: "fact",
  confidence: 1,
  value: "CodePilot",
});
```

---

# Delete Memory

Delete a memory using its ID.

```ts
await client.deleteMemory("memory-id");
```

After deletion, the memory will no longer be available through normal memory retrieval.

---

# Complete Example

A basic application can use Persista like this:

```ts
import { PersistaClient } from "@persista/sdk";

const client = new PersistaClient({
  baseUrl: "http://localhost:3000",
});

// Store conversation
await client.remember({
  conversation: {
    messages: [
      {
        role: "user",
        content:
          "CodePilot uses React and Hono and is deployed on AWS.",
      },
    ],
  },
});

// Retrieve memory
const result = await client.search({
  query: "What technologies does CodePilot use?",
  limit: 10,
  graphDepth: 2,
});

console.log(result.results);
```

---

# Typical Application Flow

A typical AI application can use Persista alongside its existing LLM.

```text
User
 │
 ▼
AI Application
 │
 ├──────────────► Persista
 │                    │
 │                    ▼
 │              Retrieve Memory
 │                    │
 │                    ▼
 │              Relevant Context
 │                    │
 └──────────────► LLM
                      │
                      ▼
                   Response
```

When new information is learned:

```text
Conversation
     │
     ▼
Persista.remember()
     │
     ▼
Persistent Memory
```

When context is required:

```text
User Query
     │
     ▼
Persista.search()
     │
     ▼
Relevant Memories
     │
     ▼
LLM Context
```

---

# Client API

The SDK currently exposes the following core operations:

| Method           | Purpose                                 |
| ---------------- | --------------------------------------- |
| `remember()`     | Store a conversation and extract memory |
| `search()`       | Retrieve relevant memories              |
| `updateMemory()` | Update an existing memory               |
| `deleteMemory()` | Delete a memory                         |

---

# TypeScript

The SDK is written in TypeScript and exposes typed request and response contracts.

This allows applications to get compile-time checking when interacting with Persista.

```ts
const result = await client.search({
  query: "What do I prefer?",
  limit: 5,
});
```

Invalid request structures can therefore be detected during development rather than at runtime.

---

# Configuration

The SDK currently requires the Persista API URL.

```ts
const client = new PersistaClient({
  baseUrl: "http://localhost:3000",
});
```

For production deployments:

```ts
const client = new PersistaClient({
  baseUrl: "https://your-persista-api.example.com",
});
```

The SDK does not require applications to directly configure Qdrant, Neo4j, embedding providers, or LLM providers.

Those infrastructure concerns remain on the Persista server.

---

# Design Goal

The SDK is intentionally small.

Applications should only need to understand:

```text
remember()
search()
updateMemory()
deleteMemory()
```

The underlying memory extraction, embedding generation, vector storage, graph storage, query analysis, and hybrid retrieval remain internal Persista infrastructure.

This keeps the application integration simple while allowing the memory system to evolve independently.
