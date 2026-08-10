import {
  describe,
  expect,
  it,
} from "bun:test";

import {
  calculateHybridScore,
} from "../src";

describe(
  "calculateHybridScore",
  () => {
    it(
      "should combine vector and graph scores",
      () => {
        const score =
          calculateHybridScore(
            0.8,
            0.6,
            {
              vectorWeight: 0.6,
              graphWeight: 0.4,
            },
          );

        expect(score).toBeCloseTo(
          0.72,
        );
      },
    );

    it(
      "should normalize weights",
      () => {
        const score =
          calculateHybridScore(
            0.8,
            0.6,
            {
              vectorWeight: 6,
              graphWeight: 4,
            },
          );

        expect(score).toBeCloseTo(
          0.72,
        );
      },
    );

    it(
      "should reject zero weights",
      () => {
        expect(() =>
          calculateHybridScore(
            0.8,
            0.6,
            {
              vectorWeight: 0,
              graphWeight: 0,
            },
          ),
        ).toThrow();
      },
    );
  },
);