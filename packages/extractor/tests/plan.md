# Extractor Testing Plan

## Commit

```text
test(extractor): add rule-based extraction tests
```

## Goal

Validate that every component of the extraction pipeline works correctly before integrating embeddings and storage.

---

## Test Structure

```text
packages/extractor/tests/
├── extractor.test.ts
├── rule-based.extractor.test.ts
└── preprocessors.test.ts
```

---

# 1. Preprocessor Tests

## TextCleaner

### Input

```text
Hello

    World
```

### Expected Output

```text
Hello
World
```

Verify that the cleaner:

* Removes extra spaces
* Removes duplicate blank lines
* Trims leading/trailing whitespace

---

## TextNormalizer

### Input

```text
“My name is Yogesh”
```

### Expected Output

```text
"My name is Yogesh"
```

Verify that the normalizer:

* Normalizes Unicode (`NFKC`)
* Replaces smart quotes
* Removes invisible Unicode characters

---

## SentenceSplitter

### Input

```text
My name is Yogesh.
I work on Persista.
I like TypeScript.
```

### Expected Output

```ts
[
  "My name is Yogesh",
  "I work on Persista",
  "I like TypeScript",
]
```

Verify that the splitter:

* Splits by punctuation and newlines
* Trims each sentence
* Ignores empty results

---

# 2. Rule-Based Extractor Tests

### Input

```ts
[
  "My name is Yogesh",
  "I work on Persista",
  "I prefer TypeScript",
  "I'm learning Rust",
]
```

### Expected Output

```ts
[
  {
    content: "My name is Yogesh",
    type: "identity",
    value: "Yogesh",
  },
  {
    content: "I work on Persista",
    type: "fact",
    value: "Persista",
  },
  {
    content: "I prefer TypeScript",
    type: "preference",
    value: "TypeScript",
  },
  {
    content: "I'm learning Rust",
    type: "goal",
    value: "Rust",
  },
]
```

Verify that the extractor:

* Detects the correct memory type
* Extracts the expected value
* Assigns the configured confidence
* Includes metadata for the matched rule

---

# 3. Extractor Integration Test

Create a complete extraction flow using all components.

### Input Conversation

```text
User:
My name is Yogesh.
I work on Persista.
I prefer TypeScript.
I'm learning Rust.
```

### Expected Flow

```text
Conversation
      │
      ▼
TextCleaner
      │
      ▼
TextNormalizer
      │
      ▼
SentenceSplitter
      │
      ▼
RuleBasedExtractor
      │
      ▼
ExtractionResult
```

### Assertions

* The conversation is converted into text correctly.
* The preprocessing pipeline runs successfully.
* The strategy returns the expected extracted memories.
* The result contains one memory per matched sentence.
* `processingTime` is greater than or equal to zero.

---

# Coverage Goals

* Preprocessor components
* Rule-based extraction logic
* End-to-end extraction pipeline
* Edge cases (empty input, unmatched sentences, whitespace-only input)

---

## Outcome

Completing these tests verifies that the extraction pipeline is functioning correctly and provides a stable foundation before implementing the embedding provider, vector store, and memory engine.
