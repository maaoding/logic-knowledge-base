import { branches, entryManifest, practiceQuestions } from "@logic/domain";
import { describe, expect, it } from "vitest";

describe("shared practice domain", () => {
  it("contains the agreed catalog and question counts", () => {
    expect(branches).toHaveLength(10);
    expect(entryManifest).toHaveLength(36);
    expect(practiceQuestions).toHaveLength(30);
  });

  it("contains two single and one multiple question per branch", () => {
    for (const branch of branches) {
      const questions = practiceQuestions.filter((question) => question.branchId === branch.id);
      expect(questions.filter((question) => question.kind === "single")).toHaveLength(2);
      expect(questions.filter((question) => question.kind === "multiple")).toHaveLength(1);
    }
  });
});
