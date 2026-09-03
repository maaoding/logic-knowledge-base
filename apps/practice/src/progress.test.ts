// @vitest-environment jsdom

import { getQuestionsByBranch } from "@logic/domain";
import { beforeEach, describe, expect, it } from "vitest";
import { buildProgressOverview, collectWrongAnswers, loadBranchProgress, overrideWrongAnswer, saveBranchProgress } from "./progress";

function seedCompleteBranch(branchId: string) {
  saveBranchProgress(
    branchId,
    getQuestionsByBranch(branchId).map((question) => ({
      questionId: question.id,
      selectedIds: [...question.correctOptionIds],
      correct: true,
    })),
  );
}

function markWrong(branchId: string, questionId: string) {
  const questions = getQuestionsByBranch(branchId);
  const answers = loadBranchProgress(branchId, questions).map((record) =>
    record.questionId === questionId ? { ...record, selectedIds: ["b"], correct: false } : record,
  );
  saveBranchProgress(branchId, answers);
}

beforeEach(() => {
  localStorage.clear();
});

describe("branch progress validity", () => {
  it("discards stored records whose order no longer matches the question bank", () => {
    const questions = getQuestionsByBranch("foundations");
    localStorage.setItem("logicPractice.progress", JSON.stringify({
      foundations: [{ questionId: questions[1].id, selectedIds: ["a"], correct: false }],
    }));
    expect(loadBranchProgress("foundations", questions)).toEqual([]);
  });

  it("isolates corrupted or unknown keys from valid branches", () => {
    const questions = getQuestionsByBranch("foundations");
    localStorage.setItem("logicPractice.progress", JSON.stringify({
      informal: "not-an-array",
      foundations: [{ questionId: questions[0].id, selectedIds: ["a"], correct: false }],
    }));
    expect(loadBranchProgress("foundations", questions)).toHaveLength(1);
    expect(loadBranchProgress("informal", getQuestionsByBranch("informal"))).toEqual([]);
  });
});

describe("progress overview", () => {
  it("summarizes completed branches, wrong totals and per-branch states", () => {
    seedCompleteBranch("foundations");
    const traditional = getQuestionsByBranch("traditional");
    saveBranchProgress("traditional", [
      { questionId: traditional[0].id, selectedIds: ["b"], correct: false },
      { questionId: traditional[1].id, selectedIds: [...traditional[1].correctOptionIds], correct: true },
    ]);

    const overview = buildProgressOverview();
    expect(overview.completedBranches).toBe(1);
    expect(overview.wrongTotal).toBe(1);

    const byBranch = new Map(overview.branchSummaries.map((summary) => [summary.branch.id, summary]));
    expect(byBranch.get("foundations")?.state).toBe("completed");
    expect(byBranch.get("foundations")?.score).toBe(getQuestionsByBranch("foundations").length);
    expect(byBranch.get("traditional")?.state).toBe("in-progress");
    expect(byBranch.get("traditional")?.answered).toBe(2);
    expect(byBranch.get("history")?.state).toBe("not-started");
  });
});

describe("wrong answer queue", () => {
  it("orders by learning-path first occurrence, then falls back to branch and bank order", () => {
    // 三处错题：论证结构（路径第 1 位，两道题）、肯定后件（路径成员）、文恩图检验（不在任何路径）
    seedCompleteBranch("foundations");
    seedCompleteBranch("informal");
    seedCompleteBranch("traditional");

    const argumentStructureIds = getQuestionsByBranch("foundations")
      .filter((question) => question.entrySlug === "argument-structure")
      .map((question) => question.id);
    expect(argumentStructureIds.length).toBeGreaterThanOrEqual(2);
    const affirmingId = getQuestionsByBranch("informal").find((question) => question.entrySlug === "affirming-the-consequent")!.id;
    const vennId = getQuestionsByBranch("traditional").find((question) => question.entrySlug === "venn-diagram-testing")!.id;
    for (const questionId of argumentStructureIds) markWrong("foundations", questionId);
    markWrong("informal", affirmingId);
    markWrong("traditional", vennId);

    const queue = collectWrongAnswers();
    expect(queue.map((item) => item.question.id)).toEqual([...argumentStructureIds, affirmingId, vennId]);
    // 已完成与进行中分支的错题都会进入队列
    expect(new Set(queue.map((item) => item.branch.id))).toEqual(new Set(["foundations", "informal", "traditional"]));
  });
});

describe("single record override", () => {
  it("overwrites only the wrong record with the corrected answer", () => {
    seedCompleteBranch("foundations");
    const questions = getQuestionsByBranch("foundations");
    markWrong("foundations", questions[0].id);
    const wrongItem = collectWrongAnswers()[0];
    expect(wrongItem?.question.id).toBe(questions[0].id);

    overrideWrongAnswer(wrongItem!, ["a"]);

    const answers = loadBranchProgress("foundations", questions);
    expect(answers).toHaveLength(questions.length);
    expect(answers[0]).toEqual({ questionId: questions[0].id, selectedIds: ["a"], correct: true });
    expect(answers[1]).toEqual({ questionId: questions[1].id, selectedIds: [...questions[1].correctOptionIds], correct: true });
  });

  it("reports whether the record was actually written", () => {
    const questions = getQuestionsByBranch("foundations");
    seedCompleteBranch("foundations");
    markWrong("foundations", questions[0].id);
    const wrongItem = collectWrongAnswers()[0];

    expect(overrideWrongAnswer(wrongItem!, ["a"])).toBe(true);

    // 记录已被另一标签页清空时不再写入，也不应被计为“已消除”
    saveBranchProgress("foundations", []);
    const staleItem = { ...wrongItem! };
    expect(overrideWrongAnswer(staleItem, ["a"])).toBe(false);
    expect(loadBranchProgress("foundations", questions)).toEqual([]);
  });
});
