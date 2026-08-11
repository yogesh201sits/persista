# Persista — Technical Documentation

[![Vector Store](https://img.shields.io/badge/vector--store-Qdrant-DC244C)](https://qdrant.tech/)
[![Graph Store](https://img.shields.io/badge/graph--store-Neo4j-008CC1?logo=neo4j&logoColor=white)](https://neo4j.com/)
[![Database](https://img.shields.io/badge/database-PostgreSQL%20%2F%20Neon-4169E1?logo=postgresql&logoColor=white)](https://neon.tech/)
[![ORM](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![LLM](https://img.shields.io/badge/LLM-Groq-F55036)](https://groq.com/)
[![LLM Framework](https://img.shields.io/badge/framework-LangChain-1C3C3C)](https://www.langchain.com/)
[![Embeddings](https://img.shields.io/badge/embeddings-Hugging%20Face-FFD21E?logo=huggingface&logoColor=black)](https://huggingface.co/)
[![API](https://img.shields.io/badge/API-Hono-E36002)](https://hono.dev/)
[![Runtime](https://img.shields.io/badge/runtime-Bun-000000?logo=bun)](https://bun.sh/)
[![Ranking](https://img.shields.io/badge/ranking-RRF-9146FF)](#hybrid-retrieval)
[![Retrieval](https://img.shields.io/badge/retrieval-hybrid-8A2BE2)](#hybrid-retrieval)
[![Tests](https://img.shields.io/badge/tests-bun%20test-000000?logo=bun)](#testing)
[![Architecture](https://img.shields.io/badge/architecture-provider--agnostic-informational)](#provider-architecture)

This document covers Persista's internal architecture, memory pipeline, retrieval system, provider model, package structure, API, testing, and design decisions.

For the project overview, SDK usage, and quick start, see [README.md](../README.md).

---

## Architecture

Persista is a modular monorepo designed around independent memory, storage, retrieval, and provider abstractions.

At a high level:

```text
                         AI Application
                               │
                               ▼
                         Persista SDK
                               │
                               ▼
                         Memory Manager
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
          Extractor        Embeddings       Retrieval
              │                │                │
              ▼                ▼         ┌──────┴──────┐
             LLM             Provider    │             │
                                         ▼             ▼
                                      Vector         Graph
                                       Store         Store
                                         │             │
                                         ▼             ▼
                                      Qdrant         Neo4j
                                         │             │
                                         └──────┬──────┘
                                                ▼
                                           Hybrid Rank
```

The architecture is based on dependency injection and provider abstractions. Core components do not directly construct infrastructure providers.

---

## Repository Structure

```text
persista/
│
├── apps/
│   ├── api/
│   └── playground/
│
└── packages/
    ├── config/
    ├── core/
    ├── database/
    ├── embeddings/
    ├── extractor/
    ├── graph/
    ├── providers/
    ├── ranking/
    ├── sdk/
    ├── shared/
    └── vector-store/
```

### Applications

| Application  | Responsibility                              |
| ------------ | ------------------------------------------- |
| `api`        | HTTP API built with Hono                    |
| `playground` | Development and experimentation environment |

### Packages

| Package        | Responsibility                                              |
| -------------- | ----------------------------------------------------------- |
| `core`         | Memory lifecycle and orchestration                          |
| `extractor`    | Memory extraction                                           |
| `embeddings`   | Embedding generation                                        |
| `vector-store` | Vector storage abstraction and providers                    |
| `graph`        | Entities, relationships, graph storage, and graph retrieval |
| `ranking`      | Retrieval engines and ranking                               |
| `sdk`          | TypeScript client                                           |
| `shared`       | Shared types and contracts                                  |
| `config`       | Application configuration                                   |
| `database`     | PostgreSQL / Prisma infrastructure                          |
| `providers`    | Provider implementations                                    |

---

# Memory Architecture

Persista stores memory through two complementary representations:

1. Semantic memory
2. Relational graph memory

```text
                         Conversation
                              │
                              ▼
                       Memory Extraction
                              │
                              ▼
                       Structured Memory
                              │
                 ┌────────────┴────────────┐
                 │                         │
                 ▼                         ▼
           Vector Memory              Graph Memory
                 │                         │
                 ▼                         ▼
              Qdrant                    Neo4j
```

The two representations serve different retrieval requirements.

### Vector memory

Vector memory represents information semantically.

Example:

```text
"I prefer React for frontend development"
```

The memory is embedded and stored in the vector store.

Vector retrieval is useful when the query and memory have similar meaning even if they use different wording.

### Graph memory

Graph memory represents entities and explicit relationships.

Example:

```text
CodePilot ──uses────────► React
CodePilot ──uses────────► Hono
CodePilot ──deployed on─► AWS
```

Graph retrieval is useful when relationships between entities are important.

---

# Write Path

When an application stores a conversation, Persista processes it through the memory pipeline.

```text
Conversation
     │
     ▼
Memory Manager
     │
     ▼
Memory Extractor
     │
     ▼
Structured Memories
     │
     ├──────────────────────┐
     ▼                      ▼
Embedding Pipeline      Graph Pipeline
     │                      │
     ▼                      ▼
Vector Store            Graph Store
(Qdrant)                (Neo4j)
```

## Memory Extraction

The extractor identifies useful information from conversations.

Supported memory types include:

```text
fact
identity
preference
goal
relationship
```

Example:

```json
{
  "content": "I prefer React for frontend development",
  "type": "preference",
  "confidence": 1
}
```

The extractor supports different extraction strategies through an abstraction rather than coupling the core memory manager to a specific extraction implementation.

---

# Embedding Pipeline

Structured memories that require semantic retrieval are converted into embeddings.

```text
Memory
  │
  ▼
EmbeddingProvider
  │
  ▼
Vector
  │
  ▼
VectorStore
```

The embedding layer is provider-agnostic.

The current implementation uses Hugging Face as the embedding provider.

The core system depends on the `EmbeddingProvider` abstraction rather than directly depending on Hugging Face.

---

# Graph Memory

Graph memory represents entities and relationships extracted from conversations.

```text
Conversation
     │
     ▼
Graph Extractor
     │
     ▼
Entities + Relationships
     │
     ▼
Entity Resolver
     │
     ▼
Graph Store
     │
     ▼
Neo4j
```

## Entity Resolution

Entity resolution prevents multiple representations of the same entity from being stored as unrelated graph nodes.

For example:

```text
React
react
React.js
```

can potentially be resolved to the same graph entity.

The resolver works through the `EntityResolver` abstraction.

---

# Graph Retrieval

Graph retrieval starts from an entity identified in the query and traverses related entities.

Example:

```text
CodePilot
   │
   ├── uses ──► React
   │
   ├── uses ──► Hono
   │
   └── uses ──► TypeScript
```

The retrieval depth controls how far the graph can be traversed.

For example:

```text
depth = 1

CodePilot
   ├── React
   ├── Hono
   └── TypeScript
```

A larger depth allows deeper relationships to be considered.

Graph results contain:

* Entity
* Relationship
* Relationship confidence
* Traversal depth

Graph relevance is calculated using relationship confidence and traversal depth.

Direct relationships receive higher relevance than deeper relationships.

---

# Retrieval Architecture

Retrieval is separated into independent contracts.

The core abstraction is:

```text
BaseRetrievalEngine<TOptions, TResult>
```

Vector retrieval and hybrid retrieval then provide different contracts.

```text
BaseRetrievalEngine
        │
        ├── RetrievalEngine
        │      │
        │      └── VectorSearchResult[]
        │
        └── HybridRetrievalEngine
               │
               └── HybridSearchResult
```

This separation is intentional.

A hybrid search result contains more information than a vector search result because it may contain:

* Vector memory
* Graph entity
* Relationships
* Retrieval sources
* Hybrid score

Therefore, `HybridRetrievalEngine` does not extend `RetrievalEngine`.

---

# Hybrid Retrieval

Hybrid retrieval is Persista's unified retrieval strategy.

Persista does not use an LLM router to choose between vector search and graph search.

Instead, both retrieval sources participate in the hybrid retrieval pipeline.

```text
                         Query
                           │
                           ▼
                    Query Analyzer
                           │
                           ▼
                   Extracted Entities
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
      Vector Retrieval             Graph Retrieval
             │                           │
             ▼                           ▼
      Vector Candidates           Graph Candidates
             │                           │
             └─────────────┬─────────────┘
                           ▼
                     Candidate Merge
                           │
                           ▼
                    Ranking / RRF
                           │
                           ▼
                   HybridSearchResult
```

## Retrieval Flow

The hybrid engine performs the following steps:

1. Analyze the query.
2. Extract graph-relevant entities.
3. Run vector retrieval.
4. Run graph retrieval when relevant entities are available.
5. Convert both result sets into rankings.
6. Merge candidates from both sources.
7. Calculate the RRF score.
8. Sort candidates by hybrid score.
9. Return the final result set.

---

# Query Analysis

The query analyzer uses an LLM to identify entities that may be relevant to graph retrieval.

For example:

```text
"What technologies does CodePilot use?"
```

can produce:

```json
{
  "entities": [
    "CodePilot"
  ]
}
```

The extracted entity is then used to perform graph retrieval.

The query analyzer does not decide whether vector search should run.

Vector retrieval remains part of the hybrid retrieval process.

---

# Reciprocal Rank Fusion

Vector and graph retrieval produce different scoring systems.

For example:

```text
Vector similarity:
0.82
```

Graph relevance may instead depend on:

```text
confidence
depth
```

These scores should not be directly added because they are not necessarily comparable.

Persista therefore converts both result sets into rankings and combines the rankings using Reciprocal Rank Fusion.

Conceptually:

```text
Vector Ranking
      │
      ├── rank 1
      ├── rank 2
      └── rank 3

Graph Ranking
      │
      ├── rank 1
      ├── rank 2
      └── rank 3
            │
            ▼
           RRF
            │
            ▼
      Hybrid Ranking
```

An item appearing in both retrieval sources receives contributions from both rankings.

This allows hybrid retrieval to favor candidates supported by both semantic and relational evidence.

---

# Hybrid Search Result

The hybrid engine returns:

```ts
interface HybridSearchResult {
  query: string;
  results: HybridSearchItem[];
}
```

Each result may contain:

```ts
interface HybridSearchItem {
  id: string;
  score: number;
  sources: Array<"vector" | "graph">;

  memory?: VectorSearchResult;

  entity?: GraphSearchResult["entity"];

  relationships?: GraphSearchResult["relationships"];
}
```

The `sources` field identifies which retrieval systems contributed to the result.

For example:

```json
{
  "id": "memory-id",
  "score": 0.032,
  "sources": [
    "vector",
    "graph"
  ]
}
```

---

# Retrieval Options

Hybrid retrieval supports options such as:

```ts
interface HybridSearchOptions {
  limit?: number;
  minScore?: number;
  filter?: VectorSearchFilter[];

  graphDepth?: number;

  vectorWeight?: number;
  graphWeight?: number;
}
```

The `limit` controls the final number of returned results.

`minScore` and vector filters are forwarded to vector retrieval.

`graphDepth` controls graph traversal depth.

Vector and graph weights can be used by ranking implementations that require weighted scoring.

---

# LLM Usage

LLMs are used in two primary parts of the system.

## Memory extraction

The LLM converts unstructured conversation into structured memories.

```text
Conversation
     │
     ▼
     LLM
     │
     ▼
Structured Memory
```

## Query analysis

The LLM identifies entities relevant to graph retrieval.

```text
Query
  │
  ▼
 LLM
  │
  ▼
Entities
```


The LLM is not used as a retrieval router.

Persista's retrieval strategy remains hybrid retrieval.

---

# Provider Architecture

Persista separates core interfaces from infrastructure providers.

```text
LLMProvider
   │
   └── LangChain / Groq


EmbeddingProvider
   │
   └── Hugging Face


VectorStore
   │
   └── Qdrant


GraphStore
   │
   └── Neo4j
```

The core system depends on these abstractions instead of concrete infrastructure implementations.

For example:

```text
VectorStore
   │
   ├── Qdrant
   ├── Future Provider
   └── Future Provider
```

A different vector database can therefore be introduced without changing the core retrieval architecture.

The same principle applies to:

* LLM providers
* Embedding providers
* Vector stores
* Graph stores

---

# Dependency Injection

Persista uses dependency injection to keep components independent.

A simplified composition looks like:

```text
EmbeddingProvider ───────┐
                         │
VectorStore ─────────────┤
                         ▼
RankingStrategy ─────► RetrievalEngine
                         │
                         ▼
                    MemoryManager
```

For hybrid retrieval:

```text
VectorRetrievalEngine ──┐
                        │
GraphRetrievalEngine ───┤
                        ▼
QueryAnalyzer ─────────► HybridRetrievalEngine
                        │
                        ▼
                   MemoryManager
```

Infrastructure providers are constructed at the application composition root and injected into the relevant services.

---

# API

Persista exposes an HTTP API using Hono.

## Remember

```http
POST /memories
```

Example:

```json
{
  "conversation": {
    "messages": [
      {
        "role": "user",
        "content": "I prefer React."
      }
    ]
  }
}
```

The request is processed by both the memory pipeline and graph memory pipeline.

---

## Search

```http
POST /memories/search
```

Example:

```json
{
  "query": "What technologies does CodePilot use?",
  "limit": 10,
  "graphDepth": 2
}
```

The API returns a `HybridSearchResult`.

---

## Update

```http
PUT /memories/:id
```

Updates an existing memory.

---

## Delete

```http
DELETE /memories/:id
```

Deletes an existing memory.

---

# SDK Architecture

The SDK provides a client-facing abstraction over the HTTP API.

```text
Application
     │
     ▼
PersistaClient
     │
     ▼
HTTP API
     │
     ▼
MemoryManager
     │
     ▼
Retrieval / Storage
```

The SDK prevents applications from needing to understand the internal memory pipeline.

---

# Testing

Persista uses Bun's test runner.

Run all tests:

```bash
bun test
```

Run a specific package:

```bash
bun test packages/extractor
bun test packages/embeddings
bun test packages/ranking
bun test packages/sdk
```

The project includes tests for:

* Memory extraction
* Text preprocessing
* Embeddings
* Vector retrieval
* Graph retrieval
* Graph relevance
* Hybrid retrieval
* RRF ranking
* SDK requests
* API behavior

The ranking package currently tests:

* Graph relevance
* Hybrid retrieval
* Hybrid scoring
* Reciprocal Rank Fusion

---

# Design Principles

## Provider Agnostic

Core memory logic should not depend on a specific infrastructure provider.

## Modular

Extraction, embeddings, storage, graph, ranking, retrieval, and orchestration are separate components.

## Dependency Injected

Infrastructure implementations are passed into services rather than constructed internally.

## Explicit Contracts

Different retrieval strategies have different contracts rather than being forced into a single result type.

## Retrieval Focused

Persista focuses on retrieving useful memory rather than simply storing conversation history.

## Hybrid by Design

Semantic similarity and explicit relationships complement each other.

Persista treats vector and graph retrieval as first-class retrieval sources rather than forcing applications to choose between them.

## LLM Where It Adds Value

LLMs are used for semantic tasks such as memory extraction and query/entity analysis.

They are not used as an unnecessary routing layer between retrieval systems.

---

# Current Providers

| Capability   | Provider            |
| ------------ | ------------------- |
| LLM          | Groq via LangChain  |
| Embeddings   | Hugging Face        |
| Vector Store | Qdrant              |
| Graph Store  | Neo4j               |
| API          | Hono                |
| Database     | PostgreSQL / Prisma |
| Runtime      | Bun                 |
| Language     | TypeScript          |

The provider list represents the current implementation and is not intended to limit the architecture to these providers.

---

# Development

Install dependencies:

```bash
bun install
```

Run the development environment:

```bash
bun run dev
```

Run tests:

```bash
bun test
```

Run package-specific tests:

```bash
bun test packages/ranking
```

The repository uses Bun workspaces for monorepo package management.

---

# Technical Direction

The architecture is designed to allow Persista to evolve toward a broader memory infrastructure without coupling the core system to individual storage or model providers.

Current areas of development include:

* Retrieval evaluation
* Better entity linking
* Memory conflict resolution
* Temporal memory
* Retrieval observability
* Retrieval benchmarks
* Additional providers
* Production deployment tooling
