<div align="center">

<img width="500" height="270" alt="persistalogo" src="https://github.com/user-attachments/assets/00d321be-b366-4f03-9878-4f6e359229d3" />

# Persista

<br/>

 > **Persistent memory infrastructure for AI agents.**

<br/>
 
[![Status](https://img.shields.io/badge/status-active--development-yellow)](#status)
[![Runtime](https://img.shields.io/badge/runtime-Bun-000000?logo=bun)](https://bun.sh/)
[![Language](https://img.shields.io/badge/language-TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vector Store](https://img.shields.io/badge/vector--store-Qdrant-DC244C)](https://qdrant.tech/)
[![Graph Store](https://img.shields.io/badge/graph--store-Neo4j-008CC1?logo=neo4j&logoColor=white)](https://neo4j.com/)
[![ORM](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![LLM Framework](https://img.shields.io/badge/framework-LangChain-1C3C3C)](https://www.langchain.com/)
[![API](https://img.shields.io/badge/API-Hono-E36002)](https://hono.dev/)
[![Monorepo](https://img.shields.io/badge/monorepo-Bun%20Workspaces-000000?logo=bun)](#architecture)
[![Runtime](https://img.shields.io/badge/runtime-Bun-000000?logo=bun)](https://bun.sh/)
[![Architecture](https://img.shields.io/badge/architecture-provider--agnostic-informational)](#provider-architecture)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](#contributing)

</div>
 
Persista is a modular, provider-agnostic memory infrastructure for AI applications. It combines **semantic memory, knowledge graphs, and hybrid retrieval** to give agents persistent, structured, and retrievable memory.

Instead of building memory extraction, embeddings, vector storage, graph storage, and retrieval independently for every AI application, Persista provides them as reusable infrastructure.

For architecture, retrieval internals, API reference, package structure, and technical implementation details, see [**TECHNICAL.md**](docs/TECHNICAL.md).

---

## Why Persista?

As AI applications become more capable, conversation history alone isn't enough.

Applications need to remember:

* User preferences
* Facts learned from conversations
* Goals and important information
* Entities and their relationships
* Relevant memories for future conversations

Vector search is useful for semantic similarity:

```text
"I prefer React for frontend development"
```

Knowledge graphs are useful for explicit relationships:

```text
CodePilot ──uses────────► React
CodePilot ──uses────────► Hono
CodePilot ──deployed on─► AWS
```

Persista combines both approaches to provide richer long-term memory for AI applications.

---

## Features

* Persistent memory for AI applications
* Semantic vector retrieval
* Knowledge-graph memory
* Hybrid vector + graph retrieval
* LLM-based memory extraction
* LLM-based query and entity analysis
* Reciprocal Rank Fusion (RRF)
* Memory deduplication
* Provider-agnostic architecture
* TypeScript SDK
* HTTP API

---

## How It Works

At a high level, Persista turns conversations into persistent memories and makes them available through semantic and relational retrieval.

```text
                    Conversation
                         │
                         ▼
                  Memory Extraction
                         │
                ┌────────┴────────┐
                ▼                 ▼
          Vector Memory      Graph Memory
                │                 │
                ▼                 ▼
             Qdrant             Neo4j
                │                 │
                └────────┬────────┘
                         ▼
                  Hybrid Retrieval
                         │
                         ▼
                  Relevant Memory
```

---

## Quick Start

### Requirements

* Bun
* PostgreSQL / Neon
* Qdrant
* Neo4j
* Groq API key
* Hugging Face token

### Install

```bash
git clone https://github.com/your-username/persista.git
cd persista

bun install
```

### Environment

Create an environment configuration with the required provider credentials:

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

### Run

```bash
bun run dev
```

---

# SDK

Persista provides a TypeScript SDK for interacting with the memory infrastructure without directly dealing with the underlying HTTP API.

## Initialize

```ts
import { PersistaClient } from "@persista/sdk";

const client = new PersistaClient({
  baseUrl: "http://localhost:3000",
});
```

## Remember

Store information from a conversation:

```ts
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
```

Persista extracts useful information from the conversation and stores it as persistent memory.

## Search

Retrieve relevant memories:

```ts
const result = await client.search({
  query: "What technologies does CodePilot use?",
});
```

The retrieval system can combine semantic and graph-based information to produce a unified result.

---

## Example

A conversation such as:

```text
CodePilot uses React and Hono and is deployed on AWS.
```

can produce both semantic and relational memory:

```text
Vector Memory

"CodePilot uses React"
"CodePilot uses Hono"
"CodePilot is deployed on AWS"
```

and:

```text
Graph Memory

CodePilot
 ├── uses ─────────► React
 ├── uses ─────────► Hono
 └── deployed on ──► AWS
```

Later, a query such as:

```text
"What technologies does CodePilot use?"
```

can retrieve information from both memory systems.

---

## Architecture & Technical Documentation

For deeper technical information, see:

* [Technical Architecture](docs/TECHNICAL.md)
* [SDK Documentation](docs/SDK.md)
* [API Documentation](docs/API.md)

The technical documentation covers:

* Project architecture
* Package structure
* Memory extraction pipeline
* Embedding pipeline
* Vector storage
* Graph storage
* Entity resolution
* Graph retrieval
* Hybrid retrieval
* Query analysis
* Ranking and RRF
* Provider abstractions
* Dependency injection
* API architecture
* Testing
* Design decisions

---

## Contributing

Contributions are welcome.

Create a feature branch:

```bash
git checkout -b feat/your-feature
```

Make your changes and add tests where appropriate.

Run the test suite:

```bash
bun test
```

Then open a pull request.

For larger architectural changes, open an issue first so the design can be discussed before implementation.

---

## Status

Persista is currently under active development.

The core memory pipeline, vector memory, graph memory, hybrid retrieval, SDK, and API infrastructure are implemented and are being actively refined toward a production-ready release.

---
