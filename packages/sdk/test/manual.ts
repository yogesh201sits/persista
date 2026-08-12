import { PersistaClient } from "../src";

const client = new PersistaClient({
  baseUrl: "http://localhost:3000",
});

await client.remember({
  messages: [
    {
      role: "user",
      content:
        "I'm building an AI coding assistant called CodePilot. I use React for the frontend and Hono for the backend. I plan to deploy it on AWS.",
    },
  ],
});

console.log("Memory created successfully.");

const results = await client.search("What technologies does CodePilot use?");

console.log("Vector search results:", results);

const graphResult = await client.graphSearch("CodePilot");

console.log("Graph search result:", JSON.stringify(graphResult, null, 2));
