import {
  beforeEach,
  describe,
  expect,
  it,
} from "bun:test";

import {
  DefaultGraphRetrievalEngine,
} from "../src";

import {
  InMemoryGraphStore,
} from "../src/providers";

describe("DefaultGraphRetrievalEngine", () => {
  let graphStore: InMemoryGraphStore;
  let retrievalEngine: DefaultGraphRetrievalEngine;

  beforeEach(() => {
    graphStore =
      new InMemoryGraphStore();

    retrievalEngine =
      new DefaultGraphRetrievalEngine(
        graphStore,
      );
  });

  it("should retrieve an entity and its relationships", async () => {
    const yogesh = {
      id: crypto.randomUUID(),
      name: "Yogesh",
      type: "Person",
      metadata: {},
    };

    const bun = {
      id: crypto.randomUUID(),
      name: "Bun",
      type: "Technology",
      metadata: {},
    };

    await graphStore.upsertEntity(
      yogesh,
    );

    await graphStore.upsertEntity(
      bun,
    );

    await graphStore.upsertRelationship({
      id: crypto.randomUUID(),
      sourceId: yogesh.id,
      targetId: bun.id,
      type: "Prefers",
      confidence: 1,
    });

    const result =
      await retrievalEngine.search(
        "Yogesh",
      );

    expect(result).not.toBeNull();

    expect(
      result!.entity.name,
    ).toBe("Yogesh");

    expect(
      result!.relationships.length,
    ).toBe(1);

    expect(
      result!.relationships[0].relationship.type,
    ).toBe("Prefers");

    expect(
      result!.relationships[0].entity.name,
    ).toBe("Bun");
  });

  it("should return null for an unknown entity", async () => {
    const result =
      await retrievalEngine.search(
        "Unknown",
      );

    expect(result).toBeNull();
  });
  it("should retrieve multiple graph hops", async () => {
  const yogesh = {
    id: crypto.randomUUID(),
    name: "Yogesh",
    type: "Person",
    metadata: {},
  };

  const persista = {
    id: crypto.randomUUID(),
    name: "Persista",
    type: "Project",
    metadata: {},
  };

  const bun = {
    id: crypto.randomUUID(),
    name: "Bun",
    type: "Technology",
    metadata: {},
  };

  await graphStore.upsertEntity(yogesh);
  await graphStore.upsertEntity(persista);
  await graphStore.upsertEntity(bun);

  await graphStore.upsertRelationship({
    id: crypto.randomUUID(),
    sourceId: yogesh.id,
    targetId: persista.id,
    type: "Building",
    confidence: 1,
  });

  await graphStore.upsertRelationship({
    id: crypto.randomUUID(),
    sourceId: persista.id,
    targetId: bun.id,
    type: "Uses",
    confidence: 1,
  });

  const result =
    await retrievalEngine.search(
      "Yogesh",
      2,
    );

  expect(result).not.toBeNull();

  expect(
    result!.relationships.length,
  ).toBe(2);

  expect(
    result!.relationships[0].depth,
  ).toBe(1);

  expect(
    result!.relationships[1].depth,
  ).toBe(2);
});
});