import { branches, entryManifest, practiceQuestions } from "@logic/domain";
import { describe, expect, it } from "vitest";

describe("shared practice domain", () => {
  it("contains the agreed catalog and question counts", () => {
    expect(branches).toHaveLength(10);
    expect(entryManifest).toHaveLength(40);
    expect(practiceQuestions).toHaveLength(entryManifest.length + branches.length);
  });

  it("covers every entry and keeps at least two single and one multiple question per branch", () => {
    for (const branch of branches) {
      const entries = entryManifest.filter((entry) => entry.branchId === branch.id);
      const questions = practiceQuestions.filter((question) => question.branchId === branch.id);
      expect(questions).toHaveLength(entries.length + 1);
      expect(questions.filter((question) => question.kind === "single").length).toBeGreaterThanOrEqual(2);
      expect(questions.filter((question) => question.kind === "multiple").length).toBeGreaterThanOrEqual(1);
      for (const entry of entries) {
        expect(questions.some((question) => question.entrySlug === entry.slug)).toBe(true);
      }
    }
  });
});
