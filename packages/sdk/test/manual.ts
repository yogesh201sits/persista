import {
  PersistaClient,
} from "../src";

const client =
  new PersistaClient({
    baseUrl: "http://localhost:3000",
  });

await client.remember({
  messages: [
    {
      role: "user",
      content:
        "I prefer using Bun for my projects.",
    },
  ],
});

console.log(
  "Memory created successfully.",
);

const results = await client.search(
  "What do I prefer?",
);

console.log(
  "Search results:",
  results,
);