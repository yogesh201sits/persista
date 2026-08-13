import { PersistaClient } from "@persista/sdk";

export const client = new PersistaClient({
  apiKey: process.env.PERSISTA_API_KEY,
  baseUrl:
    process.env.PERSISTA_API_URL ??
    "http://localhost:3000",
});