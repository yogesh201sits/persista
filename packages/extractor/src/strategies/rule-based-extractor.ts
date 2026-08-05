import type { ExtractedMemory } from "../models";
import type { ExtractorStrategy } from "./extractor-strategy";

interface Rule {
  pattern: RegExp;

  type: ExtractedMemory["type"];

  confidence: number;

  rule: string;
}

const RULES: Rule[] = [
  {
    pattern: /^my name is (.+)$/i,
    type: "identity",
    confidence: 0.99,
    rule: "identity.name",
  },
  {
    pattern: /^i am (.+)$/i,
    type: "identity",
    confidence: 0.95,
    rule: "identity.self",
  },
  {
    pattern: /^i work on (.+)$/i,
    type: "fact",
    confidence: 0.95,
    rule: "project.work",
  },
  {
    pattern: /^i prefer (.+)$/i,
    type: "preference",
    confidence: 0.95,
    rule: "preference.general",
  },
  {
    pattern: /^i like (.+)$/i,
    type: "preference",
    confidence: 0.90,
    rule: "preference.like",
  },
  {
    pattern: /^i use (.+)$/i,
    type: "preference",
    confidence: 0.90,
    rule: "preference.tool",
  },
  {
    pattern: /^i(?:'m| am) learning (.+)$/i,
    type: "goal",
    confidence: 0.90,
    rule: "goal.learning",
  },
];


export class RuleBasedExtractor implements ExtractorStrategy {
  async extract(
    sentences: string[],
  ): Promise<ExtractedMemory[]> {
    const memories: ExtractedMemory[] = [];

    for (const sentence of sentences) {
      for (const rule of RULES) {
        const match = sentence.match(rule.pattern);

        if (!match) {
          continue;
        }

        memories.push({
          content: sentence,

          value: match[1].trim(),

          type: rule.type,

          confidence: rule.confidence,

          metadata: {
            extractor: "rule-based",
            rule: rule.rule,
          },
        });

        break;
      }
    }

    return memories;
  }
}