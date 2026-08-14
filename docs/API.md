# Persista API

The Persista API is the HTTP interface for interacting with Persista memory infrastructure.

The API is built with Hono and provides endpoints for storing, searching, updating, and deleting memories.

The API can be used directly or through the Persista TypeScript SDK.

---

## Base URL

For local development:

```text id="k3x1aa"
http://localhost:3000
```

For production, use the URL where the Persista API is deployed.

---

# API Overview

| Method   | Endpoint                  | Description                               |
| -------- | ------------------------- | ----------------------------------------- |
| `POST`   | `/memories`               | Store a conversation and extract memory   |
| `POST`   | `/memories/search`        | Search persistent memory                  |
| `POST`   | `/memories/search/hybrid` | Search vector and graph memory separately |
| `PUT`    | `/memories/:id`           | Update a memory                           |
| `DELETE` | `/memories/:id`           | Delete a memory                           |

---

# Remember Memory

Store a conversation and allow Persista to extract persistent memory.

```http id="l2q5da"
POST /memories
Content-Type: application/json
```

### Request

```json id="a5u6s2"
{
  "conversation": {
    "messages": [
      {
        "role": "user",
        "content": "I prefer React for frontend development."
      }
    ]
  }
}
```

### Message Roles

Supported message roles are:

```text id="w3p6sl"
system
user
assistant
```

### Response

```json id="6d4vys"
{
  "success": true
}
```

---

# Search Memory

Search persistent memory using a natural-language query.

```http id="5g6v8u"
POST /memories/search
Content-Type: application/json
```

### Request

```json id="t9z7h4"
{
  "query": "What frontend technologies do I prefer?"
}
```

### Search Options

The search request can include optional parameters:

```json id="ujb4b1"
{
  "query": "What technologies does CodePilot use?",
  "limit": 10,
  "minScore": 0.5,
  "graphDepth": 2
}
```

### Parameters

| Parameter    | Type                   | Required | Description                     |
| ------------ | ---------------------- | -------- | ------------------------------- |
| `query`      | `string`               | Yes      | Natural-language search query   |
| `limit`      | `number`               | No       | Maximum number of results       |
| `minScore`   | `number`               | No       | Minimum vector similarity score |
| `graphDepth` | `number`               | No       | Maximum graph traversal depth   |
| `filter`     | `VectorSearchFilter[]` | No       | Vector search filters           |

### Response

```json id="ppb9d2"
{
  "success": true,
  "results": {
    "query": "What technologies does CodePilot use?",
    "results": [
      {
        "id": "memory-id",
        "score": 0.032,
        "sources": [
          "vector",
          "graph"
        ],
        "memory": {
          "id": "memory-id",
          "score": 0.62,
          "metadata": {
            "content": "CodePilot uses React",
            "type": "fact",
            "confidence": 1,
            "createdAt": "2026-08-10T06:13:39.866Z"
          }
        },
        "entity": {
          "id": "entity-id",
          "name": "CodePilot",
          "type": "project",
          "metadata": {}
        },
        "relationships": []
      }
    ]
  }
}
```

---

# Hybrid Search

Search vector memory and graph memory independently and return both results in a single response.

```http id="m8p2va"
POST /memories/search/hybrid
Content-Type: application/json
```

### Request

```json id="f4w8qt"
{
  "query": "What technologies does CodePilot use?",
  "entity": "CodePilot",
  "limit": 5,
  "minScore": 0.5,
  "depth": 2
}
```

### Parameters

| Parameter  | Type                   | Required | Description                      |
| ---------- | ---------------------- | -------- | -------------------------------- |
| `query`    | `string`               | Yes      | Semantic search query            |
| `entity`   | `string`               | No       | Entity used for graph retrieval  |
| `limit`    | `number`               | No       | Maximum number of vector results |
| `minScore` | `number`               | No       | Minimum vector similarity score  |
| `depth`    | `number`               | No       | Graph traversal depth            |
| `filter`   | `VectorSearchFilter[]` | No       | Vector search filters            |

### Graph Search Behavior

When `entity` is provided:

```json id="m4m7ys"
{
  "query": "What technologies does CodePilot use?",
  "entity": "CodePilot"
}
```

Persista executes:

```text id="x5q7bk"
Vector Search
        +
Graph Search by Entity
```

When `entity` is not provided:

```json id="c2f6vd"
{
  "query": "What technologies does CodePilot use?"
}
```

Persista executes:

```text id="r4k8mp"
Vector Search
        +
Graph Search by Query
```

### Response

```json id="q8n1fa"
{
  "success": true,
  "results": {
    "vector": [
      {
        "id": "memory-id",
        "score": 0.94,
        "metadata": {
          "content": "CodePilot uses React"
        }
      }
    ],
    "graph": {
      "entities": [],
      "relationships": []
    }
  }
}
```

---

# Hybrid Retrieval

The search endpoint uses Persista's hybrid retrieval system.

A query can retrieve information from:

```text id="f7j4eg"
Vector Memory
     +
Graph Memory
     ↓
Hybrid Retrieval
     ↓
Ranked Results
```

The `sources` field indicates which retrieval systems contributed to each result.

### Vector-only result

```json id="0y2f6w"
{
  "sources": [
    "vector"
  ]
}
```

### Graph-only result

```json id="9q7x0l"
{
  "sources": [
    "graph"
  ]
}
```

### Result from both

```json id="a0qk5n"
{
  "sources": [
    "vector",
    "graph"
  ]
}
```

Applications do not need to call vector and graph retrieval separately.

---

# Graph Depth

Graph retrieval can traverse relationships to a configurable depth.

For example:

```json id="5u5m1f"
{
  "query": "What technologies does CodePilot use?",
  "graphDepth": 2
}
```

A depth of `1` considers directly connected entities:

```text id="3qf0c9"
CodePilot
   │
   ├── uses ──► React
   └── uses ──► Hono
```

A larger depth allows deeper relationships to participate:

```text id="n4f4pp"
CodePilot
   │
   └── uses ──► React
                  │
                  └── ecosystem ──► Next.js
```

---

# Update Memory

Update an existing memory.

```http id="5gt8mu"
PUT /memories/:id
Content-Type: application/json
```

### URL Parameter

```text id="1n7a0f"
/memories/:id
```

Example:

```text id="q1brm2"
/memories/5e6e34b1-64b1-4612-ac3b-05abb1a940a4
```

### Request

```json id="5rmx7p"
{
  "content": "I prefer React for frontend development.",
  "type": "preference",
  "confidence": 1
}
```

An optional `value` can also be supplied:

```json id="1g9y1x"
{
  "content": "CodePilot uses React",
  "type": "fact",
  "confidence": 1,
  "value": "CodePilot"
}
```

### Supported Memory Types

```text id="u2kw92"
fact
identity
preference
goal
relationship
```

### Response

```json id="w0x1t8"
{
  "success": true
}
```

---

# Delete Memory

Delete a memory by ID.

```http id="u9z3ab"
DELETE /memories/:id
```

Example:

```text id="2pr0j7"
/memories/5e6e34b1-64b1-4612-ac3b-05abb1a940a4
```

### Response

```json id="y6n0qm"
{
  "success": true
}
```

---

# Error Handling

API errors follow the application's standard error response structure.

A failed request should return an appropriate HTTP status code and an error response.

Example:

```json id="p8d0c7"
{
  "success": false,
  "error": {
    "message": "Invalid request"
  }
}
```

Common HTTP status categories include:

| Status | Meaning               |
| ------ | --------------------- |
| `200`  | Request succeeded     |
| `400`  | Invalid request       |
| `404`  | Resource not found    |
| `500`  | Internal server error |

---

# Request Validation

API requests are validated before reaching the memory services.

For example, the remember endpoint validates:

```text id="w7h2ha"
conversation
  └── messages
       ├── role
       └── content
```

Search requests validate:

```text id="4u1mcv"
query
limit
minScore
filter
graphDepth
```

Hybrid search requests validate:

```text id="x8d3kh"
query
entity
limit
minScore
depth
filter
```

Invalid requests are rejected before the underlying memory system is executed.

---

# Direct HTTP Example

Persista can be used without the SDK.

### Remember

```bash id="x2z7fp"
curl -X POST http://localhost:3000/memories \
  -H "Content-Type: application/json" \
  -d '{
    "conversation": {
      "messages": [
        {
          "role": "user",
          "content": "I prefer React for frontend development."
        }
      ]
    }
  }'
```

### Search

```bash id="h5q6v8"
curl -X POST http://localhost:3000/memories/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What frontend technologies do I prefer?",
    "limit": 10,
    "graphDepth": 2
  }'
```

### Hybrid Search

```bash id="j9p2mx"
curl -X POST http://localhost:3000/memories/search/hybrid \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What technologies does CodePilot use?",
    "entity": "CodePilot",
    "depth": 2
  }'
```

---

# API and SDK Relationship

The SDK is a thin client around the HTTP API.

```text id="h0k5nj"
TypeScript Application
        │
        ▼
 PersistaClient
        │
        ▼
   HTTP API
        │
        ▼
 Memory Manager
        │
        ▼
Memory Infrastructure
```

Applications can therefore choose between:

```text id="m1i0sa"
TypeScript
    │
    └── Persista SDK
```

or:

```text id="5a5k5q"
Any HTTP Client
    │
    └── Persista REST API
```

Both interfaces access the same underlying memory infrastructure.

---

# Current Endpoints

```text id="c9s3v4"
POST   /memories
POST   /memories/search
POST   /memories/search/hybrid
PUT    /memories/:id
DELETE /memories/:id
```

Additional endpoints may be introduced as the API evolves.

---

# API Design Principles

## Simple Interface

The API exposes a small number of operations around the memory lifecycle.

## Provider Independent

API consumers do not need to know whether Persista uses Qdrant, Neo4j, Hugging Face, Groq, or another provider internally.

## Hybrid Retrieval

The search API exposes one unified retrieval interface rather than requiring clients to separately query vector and graph systems.

The hybrid search API also allows direct access to vector and graph results when applications need more control.

## Validated Requests

API requests are validated before reaching the memory services.
