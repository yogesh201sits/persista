import { QdrantClient } from "../src/client/qdrant.client";

async function main() {
  const collectionName = "persista-vector-test";

  const client = new QdrantClient({
    url: process.env.QDRANT_URL!,
    apiKey: process.env.QDRANT_API_KEY!,
    collection: collectionName,
    dimensions: 512,
  });

  console.log("=================================");
  console.log(" Persista Qdrant Vector Test");
  console.log("=================================");

  try {
    // 1. Ensure collection
    console.log("\n1. Ensuring collection...");

    await client.ensureCollection();

    console.log("✅ Collection ready");

    // 2. Create vectors
    const vector1 = new Array(512).fill(0.1);
    const vector2 = new Array(512).fill(0.2);
    const vector3 = new Array(512).fill(0.3);

    // 3. Upsert
    console.log("\n2. Upserting points...");

    await client.upsertBatch([
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        vector: vector1,
        payload: {
          text: "I like TypeScript",
          namespace: "user-1",
        },
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440002",
        vector: vector2,
        payload: {
          text: "I am building Persista",
          namespace: "user-1",
        },
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440003",
        vector: vector3,
        payload: {
          text: "Qdrant is vector database",
          namespace: "user-1",
        },
      },
    ]);

    console.log("✅ Points inserted");

    // 4. Search
    console.log("\n3. Searching...");

    const results = await client.search(new Array(512).fill(0.15), 3);

    console.log("✅ Search completed");

    console.dir(results, {
      depth: null,
    });

    // 5. Delete
    console.log("\n4. Deleting memory-1...");

    console.log(await client.delete("550e8400-e29b-41d4-a716-446655440001"));

    console.log("✅ Deleted");

    // 6. Clear
    console.log("\n5. Clearing collection...");

    await client.clear();

    console.log("✅ Collection cleared");

    console.log("\n=================================");
    console.log(" TEST PASSED ✅");
    console.log("=================================");
  } catch (error) {
    console.error("\n❌ TEST FAILED");

    console.dir(error, {
      depth: 10,
    });

    if (error && typeof error === "object" && "data" in error) {
      console.log("\nQdrant response:");
      console.dir((error as any).data, {
        depth: 10,
      });
    }

    process.exit(1);
  }
}

await main();
