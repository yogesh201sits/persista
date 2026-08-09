import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
} from "bun:test";

import {
  DefaultGraphRetrievalEngine,
  Neo4jGraphStore,
} from "../src";

describe("Neo4jGraphRetrieval", () => {
  let graphStore: Neo4jGraphStore;
  let retrievalEngine: DefaultGraphRetrievalEngine;

  let yogeshId: string;
  let bunId: string;

  beforeAll(async () => {
    const uri =
      process.env.NEO4J_URI;

    const username =
      process.env.NEO4J_USERNAME;

    const password =
      process.env.NEO4J_PASSWORD;

    if (
      !uri ||
      !username ||
      !password
    ) {
      throw new Error(
        "NEO4J_URI, NEO4J_USERNAME and NEO4J_PASSWORD are required",
      );
    }

    graphStore =
      new Neo4jGraphStore({
        uri,
        username,
        password,
      });

    retrievalEngine =
      new DefaultGraphRetrievalEngine(
        graphStore,
      );

    yogeshId =
      crypto.randomUUID();

    bunId =
      crypto.randomUUID();

    await graphStore.upsertEntity({
      id: yogeshId,
      name: "GraphTestYogesh",
      type: "Person",
      metadata: {},
    });

    await graphStore.upsertEntity({
      id: bunId,
      name: "GraphTestBun",
      type: "Technology",
      metadata: {},
    });

    await graphStore.upsertRelationship({
      id: crypto.randomUUID(),
      sourceId: yogeshId,
      targetId: bunId,
      type: "Prefers",
      confidence: 1,
    });
  });

  afterAll(async () => {
    await graphStore.deleteEntity(
      yogeshId,
    );

    await graphStore.deleteEntity(
      bunId,
    );

    await graphStore.close();
  });

  it("should retrieve relationships from Neo4j", async () => {
    const result =
      await retrievalEngine.search(
        "GraphTestYogesh",
      );

    expect(result).not.toBeNull();

    expect(
      result!.entity.name,
    ).toBe("GraphTestYogesh");

    expect(
      result!.relationships.length,
    ).toBe(1);

    expect(
      result!.relationships[0].relationship.type,
    ).toBe("Prefers");

    expect(
      result!.relationships[0].entity.name,
    ).toBe("GraphTestBun");
  });
});