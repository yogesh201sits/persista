# Persista Providers

Persista is designed to be provider-agnostic.

Core memory logic does not directly depend on a specific LLM, embedding model, vector database, or graph database. Instead, Persista defines interfaces and injects provider implementations into the system.

This allows infrastructure providers to be replaced without changing the core memory pipeline.

---

## Provider Architecture

Persista currently separates infrastructure into four major provider categories:

```text
LLM Provider
    │
    └── LangChain / Groq

Embedding Provider
    │
    └── Hugging Face

Vector Store
    │
    └── Qdrant

Graph Store
    │
    └── Neo4j
```

The core system depends on abstractions rather than these concrete implementations.

```text
Core
 │
 ├── LLMProvider
 ├── EmbeddingProvider
 ├── VectorStore
 └── GraphStore
        │
        ▼
 Concrete Providers
```

---

# LLM Providers

LLM providers are used for operations that require language understanding.

Persista currently uses LangChain as the integration layer and Groq as the LLM provider.

```text
LLMProvider
    │
    └── LangChain
          │
          └── Groq
```

The LLM is primarily used for:

* Memory extraction
* Query/entity analysis
* Graph extraction

Persista does not use an LLM router to decide whether vector or graph retrieval should run.

Hybrid retrieval remains the retrieval strategy.

---

## LangChain / Groq

The current LLM integration uses a LangChain-based provider.

Example:

```ts
const llmProvider = new LangChainProvider({
  apiKey: config.groqApiKey,
  model: "llama-3.3-70b-versatile",
});
```

The provider is then injected into components that require LLM capabilities.

This keeps the rest of the system independent of the Groq SDK or model implementation.

---

# Embedding Providers

Embedding providers convert text into numerical vectors.

```text
Text
 │
 ▼
EmbeddingProvider
 │
 ▼
Vector
```

Persista currently uses Hugging Face.

---

## Hugging Face

The current embedding implementation uses:

```text
sentence-transformers/distiluse-base-multilingual-cased-v2
```

Example:

```ts
const embeddingProvider =
  new HuggingFaceProvider({
    apiKey: config.hfToken,
    model:
      "sentence-transformers/distiluse-base-multilingual-cased-v2",
    dimensions: 512,
  });
```

The embedding provider is used by the vector retrieval and storage pipeline.

Applications do not need to interact with the embedding provider directly when using the Persista SDK.

---

# Vector Store Providers

Vector stores persist embeddings and provide semantic similarity search.

Persista defines a vector-store abstraction so the retrieval layer does not depend directly on a particular vector database.

```text
VectorStore
    │
    ├── Qdrant
    ├── Future Provider
    └── Future Provider
```

---

## Qdrant

Qdrant is the current vector database implementation.

Example:

```ts
const vectorStore =
  new QdrantVectorStore({
    url: config.qdrantUrl,
    apiKey: config.qdrantApiKey,
    collection: "persista-vector",
    dimensions: 512,
  });
```

Qdrant is responsible for:

* Storing embeddings
* Storing memory metadata
* Semantic similarity search
* Returning vector search results

The ranking and memory-management layers do not need to know that Qdrant is being used.

---

# Graph Store Providers

Graph stores persist entities and relationships.

Persista uses a graph abstraction:

```text
GraphStore
    │
    ├── Neo4j
    ├── Future Provider
    └── Future Provider
```

This allows graph retrieval and graph memory management to remain independent of a specific graph database.

---

## Neo4j

Neo4j is the current graph database implementation.

Example:

```ts
const graphStore =
  new Neo4jGraphStore({
    uri: config.neo4jUri,
    username: config.neo4jUsername,
    password: config.neo4jPassword,
  });

await graphStore.connect();
```

Neo4j stores:

```text
Entities
    │
    └── Relationships
```

For example:

```text
CodePilot
    │
    ├── uses ──► React
    ├── uses ──► Hono
    └── deployed_on ──► AWS
```

Graph retrieval uses these relationships to provide context that semantic similarity alone may not capture.

---

# Provider Injection

Providers are created at the application composition layer and injected into the services that need them.

For example:

```ts
const vectorStore =
  new QdrantVectorStore({
    url: config.qdrantUrl,
    apiKey: config.qdrantApiKey,
    collection: "persista-vector",
    dimensions: 512,
  });

const retrievalEngine =
  new DefaultRetrievalEngine(
    embeddingProvider,
    vectorStore,
    rankingStrategy,
  );
```

The retrieval engine does not create the Qdrant client internally.

Instead:

```text
Composition Root
       │
       ├── creates provider
       │
       ▼
    Qdrant
       │
       ▼
Retrieval Engine
```

This is an important part of Persista's architecture.

---

# Why Provider Abstraction?

Without provider abstraction, application code could become tightly coupled to infrastructure:

```ts
// Avoid this inside core logic

const qdrant = new QdrantClient(...);
```

Instead, core components depend on interfaces:

```ts
class DefaultRetrievalEngine {
  constructor(
    private readonly vectorStore: VectorStore,
  ) {}
}
```

This makes it possible to replace:

```text
Qdrant
```

with another vector database without rewriting retrieval logic.

The same principle applies to:

```text
Groq
Hugging Face
Neo4j
```

---

# Adding a New Provider

To add a provider, implement the corresponding interface.

The general process is:

```text
1. Identify the provider interface
          │
          ▼
2. Implement the interface
          │
          ▼
3. Add provider-specific configuration
          │
          ▼
4. Add tests
          │
          ▼
5. Inject the provider in the composition root
```

For example, a new vector database should implement the existing `VectorStore` contract rather than modifying the retrieval engine to understand the new database.

---

# Provider Responsibilities

Each provider should have a clear responsibility.

| Provider     | Responsibility                                |
| ------------ | --------------------------------------------- |
| LLM          | Language understanding and generation         |
| Embedding    | Convert text into vectors                     |
| Vector Store | Store and retrieve vector memories            |
| Graph Store  | Store and retrieve entities and relationships |

Providers should not contain business logic that belongs to the core system.

For example, a vector provider should not decide:

```text
Which memories are important?
```

That decision belongs to retrieval and ranking.

The provider should perform its infrastructure responsibility:

```text
Store vectors
Search vectors
Return results
```

---

# Configuration

Provider credentials and infrastructure settings are configured through environment variables.

Current configuration includes:

```env
GROQ_API_KEY=

HF_TOKEN=

QDRANT_URL=
QDRANT_API_KEY=

NEO4J_URI=
NEO4J_USERNAME=
NEO4J_PASSWORD=

DATABASE_URL=
```

The application configuration layer loads and validates these values.

Providers receive configuration through constructors rather than reading environment variables directly.

---

# Current Provider Stack

The current Persista development stack is:

| Category        | Provider          |
| --------------- | ----------------- |
| LLM integration | LangChain         |
| LLM             | Groq              |
| Embeddings      | Hugging Face      |
| Vector database | Qdrant            |
| Graph database  | Neo4j             |
| API             | Hono              |
| Database        | PostgreSQL / Neon |
| ORM             | Prisma            |

The infrastructure stack can evolve without changing the public SDK interface.

---

# Provider Selection

Applications using the Persista SDK do not need to select individual providers.

For example, an application only needs:

```ts
const client = new PersistaClient({
  baseUrl: "http://localhost:3000",
});
```

The Persista server is responsible for configuring:

```text
LLM
Embedding
Vector Store
Graph Store
```

This keeps infrastructure configuration separate from application integration.

---

# Design Rules

When adding or modifying providers, follow these principles:

### Depend on interfaces

Core components should depend on abstractions.

```text
Core → Interface → Provider
```

Not:

```text
Core → Qdrant
Core → Neo4j
Core → Groq
```

### Keep providers focused

A provider should implement infrastructure behavior, not application-level business logic.

### Inject dependencies

Providers should be created outside the services that consume them.

### Keep provider-specific code isolated

Provider SDKs and implementation details should remain inside their respective packages.

### Test providers independently

Each provider should have tests covering its implementation of the abstraction.

---

# Summary

Persista separates memory infrastructure from memory logic through provider abstractions.

```text
                    Persista Core
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   LLMProvider    EmbeddingProvider   Storage
        │                │           ┌────┴────┐
        ▼                ▼           ▼         ▼
      Groq          Hugging Face   Qdrant    Neo4j
                                  Vector      Graph
```

The goal is simple:

> **Providers can change without forcing the memory system to change.**
