import { describe, expect, test } from "bun:test";
import {
  SentenceSplitter,
  TextCleaner,
  TextNormalizer,
} from "../src/preprocessors";

describe("TextCleaner", () => {
  const cleaner = new TextCleaner();

  test("should trim leading and trailing whitespace", () => {
    const input = "   Hello World   ";

    expect(cleaner.clean(input)).toBe("Hello World");
  });

  test("should collapse multiple spaces", () => {
    const input = "Hello     World";

    expect(cleaner.clean(input)).toBe("Hello World");
  });

  test("should collapse multiple blank lines", () => {
    const input = "Hello\n\n\nWorld";

    expect(cleaner.clean(input)).toBe("Hello\nWorld");
  });

  test("should normalize Windows line endings", () => {
    const input = "Hello\r\nWorld";

    expect(cleaner.clean(input)).toBe("Hello\nWorld");
  });

  test("should clean mixed whitespace", () => {
    const input = "   Hello\t\tWorld\n\n\nPersista   ";

    expect(cleaner.clean(input)).toBe("Hello World\nPersista");
  });
});

describe("TextNormalizer", () => {
  const normalizer = new TextNormalizer();

  test("should normalize unicode", () => {
    const input = "Hello";

    expect(normalizer.normalize(input)).toBe("Hello");
  });

  test("should replace smart double quotes", () => {
    const input = "“Hello World”";

    expect(normalizer.normalize(input)).toBe("\"Hello World\"");
  });

  test("should replace smart single quotes", () => {
    const input = "‘Persista’";

    expect(normalizer.normalize(input)).toBe("'Persista'");
  });

  test("should remove zero-width spaces", () => {
    const input = "Hello\u200BWorld";

    expect(normalizer.normalize(input)).toBe("HelloWorld");
  });
});

describe("SentenceSplitter", () => {
  const splitter = new SentenceSplitter();

  test("should split sentences by period", () => {
    const input =
      "My name is Yogesh. I work on Persista. I like TypeScript.";

    expect(splitter.split(input)).toEqual([
      "My name is Yogesh",
      "I work on Persista",
      "I like TypeScript",
    ]);
  });

  test("should split by newline", () => {
    const input =
      "My name is Yogesh\nI work on Persista\nI like TypeScript";

    expect(splitter.split(input)).toEqual([
      "My name is Yogesh",
      "I work on Persista",
      "I like TypeScript",
    ]);
  });

  test("should split by question mark and exclamation mark", () => {
    const input =
      "How are you? I am fine! I like Persista.";

    expect(splitter.split(input)).toEqual([
      "How are you",
      "I am fine",
      "I like Persista",
    ]);
  });

  test("should ignore empty sentences", () => {
    const input =
      "Hello...\n\nWorld!!!";

    expect(splitter.split(input)).toEqual([
      "Hello",
      "World",
    ]);
  });

  test("should return empty array for empty input", () => {
    expect(splitter.split("")).toEqual([]);
  });
});