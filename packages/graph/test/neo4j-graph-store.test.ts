import { afterAll, beforeAll, describe, expect, it } from "bun:test";

import { Neo4jGraphStore } from "../src";

import type { Entity, Relationship } from "../src";

describe("Neo4jGraphStore", () => {
  let store: Neo4jGraphStore;

  const entityId = "test-user-yogesh";

  const bunId = "test-bun";

  const relationshipId = "test-yogesh-bun";

  beforeAll(async () => {
    const uri = process.env.NEO4J_URI;

    const username = process.env.NEO4J_USERNAME;

    const password = process.env.NEO4J_PASSWORD;

    const database = process.env.NEO4J_DATABASE;

    if (!uri || !username || !password) {
      throw new Error(
        "NEO4J_URI, NEO4J_USERNAME and NEO4J_PASSWORD are required",
      );
    }

    store = new Neo4jGraphStore({
      uri,
      username,
      password,
      database,
    });

    await store.connect();
  });

  afterAll(async () => {
    await store.deleteRelationship(relationshipId);

    await store.deleteEntity(entityId);

    await store.deleteEntity(bunId);

    await store.close();
  });

  it("should create and retrieve an entity", async () => {
    const entity: Entity = {
      id: entityId,
      name: "Yogesh",
      type: "Person",
    };

    await store.upsertEntity(entity);

    const result = await store.getEntity(entityId);

    console.log(result);

    expect(result).not.toBeNull();

    expect(result?.id).toBe(entityId);

    expect(result?.name).toBe("Yogesh");

    expect(result?.type).toBe("Person");
  });

  it("should create and retrieve a relationship", async () => {
    const bun: Entity = {
      id: bunId,
      name: "Bun",
      type: "Technology",
    };

    await store.upsertEntity(bun);

    const relationship: Relationship = {
      id: relationshipId,
      sourceId: entityId,
      targetId: bunId,
      type: "Prefers",
      confidence: 1,
    };

    await store.upsertRelationship(relationship);

    const results = await store.getRelationships(entityId);

    console.log(results);

    expect(results).toHaveLength(1);

    expect(results[0]?.id).toBe(relationshipId);

    expect(results[0]?.sourceId).toBe(entityId);

    expect(results[0]?.targetId).toBe(bunId);

    expect(results[0]?.type).toBe("Prefers");

    expect(results[0]?.confidence).toBe(1);
  });

  it("should delete a relationship", async () => {
    await store.deleteRelationship(relationshipId);

    const results = await store.getRelationships(entityId);

    expect(results).toHaveLength(0);
  });

  it("should delete an entity", async () => {
    await store.deleteEntity(entityId);

    const result = await store.getEntity(entityId);

    expect(result).toBeNull();
  });
});
