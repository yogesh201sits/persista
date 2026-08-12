import { describe, expect, it } from "bun:test";

import { InMemoryGraphStore } from "../src";

describe("InMemoryGraphStore", () => {
  it("should store and retrieve an entity", async () => {
    const store = new InMemoryGraphStore();

    const entity = {
      id: "user-1",
      name: "Yogesh",
      type: "person",
    };

    await store.upsertEntity(entity);

    const result = await store.getEntity("user-1");

    expect(result).toEqual(entity);
  });

  it("should return null for a missing entity", async () => {
    const store = new InMemoryGraphStore();

    const result = await store.getEntity("missing");

    expect(result).toBeNull();
  });

  it("should store and retrieve relationships", async () => {
    const store = new InMemoryGraphStore();

    const relationship = {
      id: "rel-1",
      sourceId: "user-1",
      targetId: "bun-1",
      type: "PREFERS",
      confidence: 1,
    };

    await store.upsertRelationship(relationship);

    const results = await store.getRelationships("user-1");

    expect(results).toHaveLength(1);
    expect(results[0]).toEqual(relationship);
  });

  it("should find relationships where entity is the target", async () => {
    const store = new InMemoryGraphStore();

    const relationship = {
      id: "rel-1",
      sourceId: "user-1",
      targetId: "bun-1",
      type: "PREFERS",
      confidence: 1,
    };

    await store.upsertRelationship(relationship);

    const results = await store.getRelationships("bun-1");

    expect(results).toHaveLength(1);
    expect(results[0]).toEqual(relationship);
  });

  it("should delete a relationship", async () => {
    const store = new InMemoryGraphStore();

    await store.upsertRelationship({
      id: "rel-1",
      sourceId: "user-1",
      targetId: "bun-1",
      type: "PREFERS",
      confidence: 1,
    });

    await store.deleteRelationship("rel-1");

    const results = await store.getRelationships("user-1");

    expect(results).toHaveLength(0);
  });

  it("should delete an entity and its relationships", async () => {
    const store = new InMemoryGraphStore();

    await store.upsertEntity({
      id: "user-1",
      name: "Yogesh",
      type: "person",
    });

    await store.upsertRelationship({
      id: "rel-1",
      sourceId: "user-1",
      targetId: "bun-1",
      type: "PREFERS",
      confidence: 1,
    });

    await store.deleteEntity("user-1");

    const entity = await store.getEntity("user-1");

    const relationships = await store.getRelationships("user-1");

    expect(entity).toBeNull();
    expect(relationships).toHaveLength(0);
  });
});
