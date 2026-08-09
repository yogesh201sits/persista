import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
} from "bun:test";

import {
  DefaultEntityResolver,
  GraphMemoryManager,
  LangChainGraphExtractor,
  Neo4jGraphStore,
} from "../src";

import type {
  Conversation,
} from "@persista/shared";

describe("GraphMemoryManager", () => {
  let graphStore: Neo4jGraphStore;
  let manager: GraphMemoryManager;

  beforeAll(() => {
    const groqApiKey =
      process.env.GROQ_API_KEY;

    const uri =
      process.env.NEO4J_URI;

    const username =
      process.env.NEO4J_USERNAME;

    const password =
      process.env.NEO4J_PASSWORD;

    if (
      !groqApiKey ||
      !uri ||
      !username ||
      !password
    ) {
      throw new Error(
        "GROQ_API_KEY, NEO4J_URI, NEO4J_USERNAME and NEO4J_PASSWORD are required",
      );
    }

    graphStore =
      new Neo4jGraphStore({
        uri,
        username,
        password,
      });

    const extractor =
      new LangChainGraphExtractor(
        groqApiKey,
      );

    const entityResolver =
      new DefaultEntityResolver(
        graphStore,
      );

    manager =
      new GraphMemoryManager(
        extractor,
        entityResolver,
        graphStore,
      );
  });

  afterAll(async () => {
    const yogesh =
      await graphStore.findEntity(
        "Yogesh",
        "Person",
      );

    if (yogesh) {
      await graphStore.deleteEntity(
        yogesh.id,
      );
    }

    const bun =
      await graphStore.findEntity(
        "Bun",
        "Technology",
      );

    if (bun) {
      await graphStore.deleteEntity(
        bun.id,
      );
    }

    const typescript =
      await graphStore.findEntity(
        "TypeScript",
        "Technology",
      );

    if (typescript) {
      await graphStore.deleteEntity(
        typescript.id,
      );
    }

    const persista =
      await graphStore.findEntity(
        "Persista",
        "Project",
      );

    if (persista) {
      await graphStore.deleteEntity(
        persista.id,
      );
    }

    await graphStore.close();
  });

  it("should extract and persist graph memory", async () => {
    const conversation: Conversation = {
      messages: [
        {
          role: "user",
          content:
            "My name is Yogesh. I prefer Bun and TypeScript. I am building Persista.",
        },
      ],
    };

    await manager.remember(
      conversation,
    );

    const yogesh =
      await graphStore.findEntity(
        "Yogesh",
        "Person",
      );

    expect(yogesh).not.toBeNull();

    const relationships =
      await graphStore.getRelationships(
        yogesh!.id,
      );

    expect(
      relationships.length,
    ).toBeGreaterThan(0);

    const relationshipTypes =
      relationships.map(
        (relationship) =>
          relationship.type,
      );

    expect(
      relationshipTypes,
    ).toContain("Prefers");

    expect(
      relationshipTypes,
    ).toContain("Building");
  });
  it("should reuse existing entities", async () => {
    const firstConversation: Conversation = {
      messages: [
        {
          role: "user",
          content:
            "My name is Yogesh. I prefer Bun.",
        },
      ],
    };

    await manager.remember(
      firstConversation,
    );

    const firstBun =
      await graphStore.findEntity(
        "Bun",
        "Technology",
      );

    expect(firstBun).not.toBeNull();

    const secondConversation: Conversation = {
      messages: [
        {
          role: "user",
          content:
            "I still prefer Bun.",
        },
      ],
    };

    await manager.remember(
      secondConversation,
    );

    const secondBun =
      await graphStore.findEntity(
        "Bun",
        "Technology",
      );

    expect(secondBun).not.toBeNull();

    expect(secondBun!.id).toBe(
      firstBun!.id,
    );
  });
});