import { describe, expect, mock, test } from "bun:test";

import type { GraphRetrievalEngine } from "@persista/graph";
import type { VectorSearchResult } from "@persista/vector-store";

import { DefaultHybridRetrievalEngine } from "../src/default-hybrid-retrieval-engine";
import type { QueryAnalyzerInterface } from "../src/llm";

describe("DefaultHybridRetrievalEngine", () => {
  function createVectorResult(id: string): VectorSearchResult {
    return {
      id,
    } as VectorSearchResult;
  }

  function createEntity(id: string) {
    return {
      id,
      name: id,
    };
  }

  function createGraphResult(
    entityId: string,
    relationships: {
      entityId: string;
      depth: number;
      confidence: number;
    }[] = [],
  ) {
    return {
      entity: createEntity(entityId),

      relationships: relationships.map((relationship) => ({
        entity: createEntity(relationship.entityId),

        depth: relationship.depth,

        relationship: {
          confidence: relationship.confidence,
        },
      })),
    } as Awaited<ReturnType<GraphRetrievalEngine["search"]>>;
  }

  function createEngine({
    vectorResults = [],
    graphResult = null,
    entities = [],
  }: {
    vectorResults?: VectorSearchResult[];
    graphResult?: Awaited<ReturnType<GraphRetrievalEngine["search"]>> | null;
    entities?: string[];
  } = {}) {
    const vectorSearch = mock(async () => vectorResults);

    const graphSearch = mock(async () => graphResult);

    const analyze = mock(async () => ({
      entities,
    }));

    const vectorRetrievalEngine = {
      search: vectorSearch,
    };

    const graphRetrievalEngine = {
      search: graphSearch,
    } as unknown as GraphRetrievalEngine;

    const queryAnalyzer = {
      analyze,
    } as unknown as QueryAnalyzerInterface;

    const engine = new DefaultHybridRetrievalEngine(
      vectorRetrievalEngine,
      graphRetrievalEngine,
      queryAnalyzer,
    );

    return {
      engine,
      vectorSearch,
      graphSearch,
      analyze,
    };
  }

  test("should return vector results when no graph entities are extracted", async () => {
    const vectorResults = [
      createVectorResult("memory-1"),
      createVectorResult("memory-2"),
    ];

    const { engine, vectorSearch, graphSearch, analyze } = createEngine({
      vectorResults,
      entities: [],
    });

    const result = await engine.search("What did I say about TypeScript?");

    expect(analyze).toHaveBeenCalledWith("What did I say about TypeScript?");

    expect(vectorSearch).toHaveBeenCalledWith(
      "What did I say about TypeScript?",
      {
        limit: 10,
        minScore: undefined,
      },
    );

    expect(graphSearch).not.toHaveBeenCalled();

    expect(result.query).toBe("What did I say about TypeScript?");

    expect(result.results).toHaveLength(2);

    expect(result.results[0].id).toBe("memory-1");

    expect(result.results[0].sources).toEqual(["vector"]);

    expect(result.results[1].sources).toEqual(["vector"]);
  });

  test("should perform graph search using the first extracted entity", async () => {
    const vectorResults = [createVectorResult("memory-1")];

    const graphResult = createGraphResult("entity-yogesh");

    const { engine, graphSearch } = createEngine({
      vectorResults,
      graphResult,
      entities: ["Yogesh", "TypeScript"],
    });

    await engine.search("What does Yogesh use for backend?");

    expect(graphSearch).toHaveBeenCalledWith("Yogesh", 1);
  });

  test("should use the provided graph depth", async () => {
    const graphResult = createGraphResult("entity-yogesh");

    const { engine, graphSearch } = createEngine({
      graphResult,
      entities: ["Yogesh"],
    });

    await engine.search("Tell me about Yogesh", {
      graphDepth: 3,
    });

    expect(graphSearch).toHaveBeenCalledWith("Yogesh", 3);
  });

  test("should forward limit and minScore to vector search", async () => {
    const { engine, vectorSearch } = createEngine();

    await engine.search("machine learning", {
      limit: 5,
      minScore: 0.7,
    });

    expect(vectorSearch).toHaveBeenCalledWith("machine learning", {
      limit: 5,
      minScore: 0.7,
    });
  });

  test("should include graph entity in results", async () => {
    const graphResult = createGraphResult("entity-yogesh");

    const { engine } = createEngine({
      graphResult,
      entities: ["Yogesh"],
    });

    const result = await engine.search("Tell me about Yogesh");

    expect(result.results).toHaveLength(1);

    expect(result.results[0].id).toBe("entity-yogesh");

    expect(result.results[0].sources).toEqual(["graph"]);

    expect(result.results[0].entity).toEqual(graphResult!.entity);

    expect(result.results[0].relationships).toEqual(graphResult!.relationships);
  });

  test("should merge vector and graph results for the same item", async () => {
    const vectorResults = [createVectorResult("shared")];

    const graphResult = createGraphResult("shared");

    const { engine } = createEngine({
      vectorResults,
      graphResult,
      entities: ["Yogesh"],
    });

    const result = await engine.search("Yogesh");

    expect(result.results).toHaveLength(1);

    const item = result.results[0];

    expect(item.id).toBe("shared");

    expect(item.sources).toEqual(["vector", "graph"]);

    expect(item.memory).toEqual(vectorResults[0]);

    expect(item.entity).toEqual(graphResult!.entity);
  });

  test("should return both vector-only and graph-only candidates", async () => {
    const vectorResults = [createVectorResult("vector-1")];

    const graphResult = createGraphResult("graph-1");

    const { engine } = createEngine({
      vectorResults,
      graphResult,
      entities: ["Yogesh"],
    });

    const result = await engine.search("Yogesh");

    expect(result.results).toHaveLength(2);

    const vectorItem = result.results.find((item) => item.id === "vector-1");

    const graphItem = result.results.find((item) => item.id === "graph-1");

    expect(vectorItem).toBeDefined();

    expect(vectorItem?.sources).toEqual(["vector"]);

    expect(graphItem).toBeDefined();

    expect(graphItem?.sources).toEqual(["graph"]);
  });

  test("should give a higher RRF score to an item appearing in both sources", async () => {
    const vectorResults = [
      createVectorResult("shared"),
      createVectorResult("vector-only"),
    ];

    const graphResult = createGraphResult("shared", [
      {
        entityId: "graph-only",
        depth: 1,
        confidence: 0.5,
      },
    ]);

    const { engine } = createEngine({
      vectorResults,
      graphResult,
      entities: ["Yogesh"],
    });

    const result = await engine.search("Yogesh");

    const shared = result.results.find((item) => item.id === "shared");

    const vectorOnly = result.results.find((item) => item.id === "vector-only");

    expect(shared).toBeDefined();

    expect(vectorOnly).toBeDefined();

    expect(shared!.score).toBeGreaterThan(vectorOnly!.score);
  });

  test("should rank graph items by confidence and depth", async () => {
    const graphResult = createGraphResult("root", [
      {
        entityId: "deep-high",
        depth: 2,
        confidence: 1,
      },
      {
        entityId: "direct-low",
        depth: 1,
        confidence: 0.4,
      },
      {
        entityId: "deep-low",
        depth: 3,
        confidence: 0.9,
      },
    ]);

    const { engine } = createEngine({
      graphResult,
      entities: ["Yogesh"],
    });

    const result = await engine.search("Yogesh");

    /*
     * Scores:
     *
     * root:
     * 1
     *
     * direct-low:
     * 0.4 / 1 = 0.4
     *
     * deep-high:
     * 1 / 2 = 0.5
     *
     * deep-low:
     * 0.9 / 3 = 0.3
     *
     * Expected:
     * root
     * deep-high
     * direct-low
     * deep-low
     */

    expect(result.results.map((item) => item.id)).toEqual([
      "root",
      "deep-high",
      "direct-low",
      "deep-low",
    ]);
  });

  test("should limit final results", async () => {
    const vectorResults = [
      createVectorResult("1"),
      createVectorResult("2"),
      createVectorResult("3"),
      createVectorResult("4"),
    ];

    const { engine } = createEngine({
      vectorResults,
      entities: [],
    });

    const result = await engine.search("test", {
      limit: 2,
    });

    expect(result.results).toHaveLength(2);
  });

  test("should default limit to 10", async () => {
    const vectorResults: VectorSearchResult[] = [];

    for (let index = 0; index < 15; index++) {
      vectorResults.push(createVectorResult(`memory-${index}`));
    }

    const { engine } = createEngine({
      vectorResults,
      entities: [],
    });

    const result = await engine.search("test");

    expect(result.results).toHaveLength(10);
  });

  test("should default graph depth to 1", async () => {
    const graphResult = createGraphResult("entity-1");

    const { engine, graphSearch } = createEngine({
      graphResult,
      entities: ["Entity"],
    });

    await engine.search("test");

    expect(graphSearch).toHaveBeenCalledWith("Entity", 1);
  });

  test("should preserve the original query in the result", async () => {
    const { engine } = createEngine({
      entities: [],
    });

    const query = "What projects am I working on?";

    const result = await engine.search(query);

    expect(result.query).toBe(query);
  });
});
