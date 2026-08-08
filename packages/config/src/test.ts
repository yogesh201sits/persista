import { LangChainProvider } from "@persista/extractor";
import {config} from "./env";
import { ExtractorFactory } from "@persista/extractor";

const llmProvider = new LangChainProvider({
  apiKey: config.groqApiKey!,
  model: "llama-3.3-70b-versatile",
});

const extractor = ExtractorFactory.create({
  type: "llm",
  llmProvider,
});

const result = await extractor.extract({
  messages: [
    {
      role: "user",
      content:
        "My name is Yogesh. I prefer TypeScript and I'm building Persista.",
    },
  ],
});

console.log(result);