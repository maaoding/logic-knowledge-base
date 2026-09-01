import { describe, expect, it } from "vitest";
import { isExactMatch, normalizeSelection, scoreAnswers } from "./scoring";

describe("practice scoring", () => {
  it("normalizes duplicate and unordered selections", () => {
    expect(normalizeSelection(["c", "a", "c"])).toEqual(["a", "c"]);
  });

  it("scores single choice by exact match", () => {
    expect(isExactMatch(["b"], ["b"])).toBe(true);
    expect(isExactMatch(["a"], ["b"])).toBe(false);
  });

  it("requires the complete multiple-choice answer set", () => {
    expect(isExactMatch(["a", "d", "b"], ["a", "b", "d"])).toBe(true);
    expect(isExactMatch(["a", "b"], ["a", "b", "d"])).toBe(false);
    expect(isExactMatch(["a", "b", "c", "d"], ["a", "b", "d"])).toBe(false);
  });

  it("counts only correct answers", () => {
    expect(scoreAnswers([
      { questionId: "one", selectedIds: ["a"], correct: true },
      { questionId: "two", selectedIds: ["b"], correct: false },
      { questionId: "three", selectedIds: ["a", "c"], correct: true },
    ])).toBe(2);
  });
});
