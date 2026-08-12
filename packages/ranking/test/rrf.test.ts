import { describe, expect, it } from "bun:test";

import { calculateRRFScore } from "../src";

describe("calculateRRFScore", () => {
  it("should calculate score for one ranking", () => {
    const score = calculateRRFScore([
      {
        id: "memory-1",
        rank: 1,
      },
    ]);

    expect(score).toBeCloseTo(1 / 61);
  });

  it("should reward items appearing in both rankings", () => {
    const score = calculateRRFScore([
      {
        id: "memory-1",
        rank: 1,
      },
      {
        id: "memory-1",
        rank: 1,
      },
    ]);

    expect(score).toBeCloseTo(2 / 61);
  });

  it("should give higher score to better ranks", () => {
    const first = calculateRRFScore([
      {
        id: "memory-1",
        rank: 1,
      },
    ]);

    const tenth = calculateRRFScore([
      {
        id: "memory-1",
        rank: 10,
      },
    ]);

    expect(first).toBeGreaterThan(tenth);
  });
});
