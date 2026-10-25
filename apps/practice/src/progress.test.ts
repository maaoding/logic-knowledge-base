// @vitest-environment jsdom

import { getQuestionsByBranch } from "@logic/domain";
import { beforeEach, describe, expect, it, vi } from "vitest";
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

// vi.spyOn 拦不住 jsdom Storage 原型上的 setItem，这里整体替换全局 localStorage 模拟被禁用的存储
function blockStorage() {
  const original = globalThis.localStorage;
  const blocked: Storage = {
    get length() { return 0; },
    clear() {},
    getItem: () => null,
    key: () => null,
    removeItem() {},
    setItem() { throw new DOMException("blocked", "SecurityError"); },
  };
  Object.defineProperty(globalThis, "localStorage", { value: blocked, configurable: true });
  return () => {
    Object.defineProperty(globalThis, "localStorage", { value: original, configurable: true });
  };
}

beforeEach(() => {
  localStorage.clear();
});

describe("branch progress validity", () => {
  it("aligns stored records to the current question order by question id", () => {
    const questions = getQuestionsByBranch("foundations");
    // 旧格式：按题目顺序存储的数组；读取时按 questionId 对齐，不再因次序变化整体作废
    localStorage.setItem("logicPractice.progress", JSON.stringify({
      foundations: [
        { questionId: questions[2].id, selectedIds: ["a"], correct: false },
        { questionId: questions[0].id, selectedIds: ["b"], correct: true },
      ],
    }));
    expect(loadBranchProgress("foundations", questions)).toEqual([
      { questionId: questions[0].id, selectedIds: ["b"], correct: true },
      { questionId: questions[2].id, selectedIds: ["a"], correct: false },
    ]);
  });

  it("skips stored records whose question is missing from the current bank", () => {
    const questions = getQuestionsByBranch("foundations");
    localStorage.setItem("logicPractice.progress", JSON.stringify({
      foundations: { ghost: { questionId: "ghost", selectedIds: [], correct: false } },
    }));
    expect(loadBranchProgress("foundations", questions)).toEqual([]);
  });

  it("stores answers keyed by question id", () => {
    const questions = getQuestionsByBranch("foundations");
    saveBranchProgress("foundations", [{ questionId: questions[1].id, selectedIds: ["a"], correct: false }]);
    const stored = JSON.parse(localStorage.getItem("logicPractice.progress")!);
    expect(stored.foundations).toEqual({
      [questions[1].id]: { questionId: questions[1].id, selectedIds: ["a"], correct: false },
    });
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

  it("does not count an override when the write fails, and keeps the original record", () => {
    const questions = getQuestionsByBranch("foundations");
    seedCompleteBranch("foundations");
    markWrong("foundations", questions[0].id);
    const wrongItem = collectWrongAnswers()[0]!;

    const restoreStorage = blockStorage();
    try {
      expect(overrideWrongAnswer(wrongItem, ["a"])).toBe(false);
      expect(
        saveBranchProgress("foundations", [{ questionId: questions[0].id, selectedIds: ["a"], correct: true }]),
      ).toBe(false);
    } finally {
      restoreStorage();
    }

    // 写入恢复后，原错题记录应原样保留
    const answers = loadBranchProgress("foundations", questions);
    expect(answers[0]).toEqual({ questionId: questions[0].id, selectedIds: ["b"], correct: false });
  });
});

describe("storage availability probe", () => {
  it("reports unavailable when writing throws, so the UI can warn instead of failing silently", async () => {
    const restoreStorage = blockStorage();
    try {
      // isStorageAvailable 的探测结果会被模块级缓存，用全新模块实例验证首次探测
      vi.resetModules();
      const { isStorageAvailable } = await import("./progress");
      expect(isStorageAvailable()).toBe(false);
      expect(isStorageAvailable()).toBe(false);
    } finally {
      restoreStorage();
      vi.resetModules();
    }
  });
});
