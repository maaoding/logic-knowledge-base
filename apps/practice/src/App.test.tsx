// @vitest-environment jsdom

import { branches, getQuestionsByBranch } from "@logic/domain";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { App } from "./App";

function setLocation(search = "") {
  window.history.replaceState({}, "", `/${search}`);
}

function selectOption(container: HTMLElement, optionId: string) {
  const input = container.querySelector<HTMLInputElement>(`input[value="${optionId}"]`);
  if (!input) throw new Error(`Missing option ${optionId}`);
  fireEvent.click(input);
}

function seedCompleteBranch(branchId: string) {
  const questions = getQuestionsByBranch(branchId);
  localStorage.setItem("logicPractice.progress", JSON.stringify({
    [branchId]: questions.map((question) => ({
      questionId: question.id,
      selectedIds: [...question.correctOptionIds],
      correct: true,
    })),
  }));
}

function seedBranchWithWrongAt(branchId: string, wrongIndex: number) {
  const questions = getQuestionsByBranch(branchId);
  localStorage.setItem("logicPractice.progress", JSON.stringify({
    [branchId]: questions.map((question, index) => ({
      questionId: question.id,
      selectedIds: index === wrongIndex ? ["b"] : [...question.correctOptionIds],
      correct: index !== wrongIndex,
    })),
  }));
}

afterEach(() => cleanup());

beforeEach(() => {
  setLocation();
  document.documentElement.dataset.theme = "light";
  localStorage.clear();
});

describe("practice application", () => {
  it("shows all ten branches and explains an invalid branch parameter", () => {
    const { container, unmount } = render(<App />);
    expect(container.querySelectorAll(".branch-card")).toHaveLength(10);
    for (const branch of branches) {
      expect(container.querySelector(`a[href="?branch=${branch.id}"]`)?.textContent).toContain(branch.title);
    }
    unmount();

    setLocation("?branch=unknown-branch");
    render(<App />);
    expect(screen.getByRole("alert").textContent).toContain("unknown-branch");
  });

  it("prevents empty submission, locks the answer, and displays the correct answer and explanation", () => {
    const branch = branches[0];
    const question = getQuestionsByBranch(branch.id)[0];
    setLocation(`?branch=${branch.id}`);
    const { container } = render(<App />);

    const submit = screen.getByRole("button", { name: "提交答案" }) as HTMLButtonElement;
    expect(submit.disabled).toBe(true);
    selectOption(container, question.options[0].id);
    expect(submit.disabled).toBe(false);
    fireEvent.click(submit);

    expect(container.querySelector("input")?.disabled).toBe(true);
    expect(screen.getByText(/正确答案：/).textContent).toContain("正确答案");
    expect(screen.getByText(question.explanation)).toBeTruthy();
    expect(screen.getByRole("link", { name: "回知识库阅读对应条目" })).toBeTruthy();
  });

  it("persists answers locally, restores them on reopen, and clears on restart", () => {
    const branch = branches[1];
    const questions = getQuestionsByBranch(branch.id);
    setLocation(`?branch=${branch.id}`);
    const firstRender = render(<App />);

    // 答第一题后离开页面
    selectOption(firstRender.container, questions[0].correctOptionIds[0]);
    fireEvent.click(screen.getByRole("button", { name: "提交答案" }));
    fireEvent.click(screen.getByRole("button", { name: "下一题" }));
    firstRender.unmount();

    // 重新打开：应恢复到第二题
    const secondRender = render(<App />);
    expect(secondRender.container.querySelector(`div[aria-label="第 2 题，共 ${questions.length} 题"]`)).toBeTruthy();
    expect(screen.queryByRole("status")).toBeNull();

    // 完成剩余题目后进入结果页
    for (const [offset, question] of questions.slice(1).entries()) {
      for (const optionId of question.correctOptionIds) selectOption(secondRender.container, optionId);
      fireEvent.click(screen.getByRole("button", { name: "提交答案" }));
      fireEvent.click(screen.getByRole("button", { name: offset === questions.length - 2 ? "查看本次结果" : "下一题" }));
    }
    expect(screen.getByText(`/ ${questions.length}`)).toBeTruthy();
    expect(screen.getAllByRole("link", { name: "阅读对应知识条目" })).toHaveLength(questions.length);
    secondRender.unmount();

    // 完成状态同样被恢复
    const thirdRender = render(<App />);
    expect(thirdRender.container.querySelector(".result-score")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "重新练习本分支" }));
    thirdRender.unmount();

    // 重新练习已清空本地进度
    const fourthRender = render(<App />);
    expect(fourthRender.container.querySelector(".result-score")).toBeNull();
    expect(fourthRender.container.querySelector(`div[aria-label="第 1 题，共 ${questions.length} 题"]`)).toBeTruthy();
    expect(screen.getByRole("button", { name: "提交答案" })).toHaveProperty("disabled", true);
  });

  it("keeps earlier informal progress when new questions are appended", () => {
    const questions = getQuestionsByBranch("informal");
    expect(questions).toHaveLength(9);
    localStorage.setItem("logicPractice.progress", JSON.stringify({
      informal: questions.slice(0, 5).map((question) => ({
        questionId: question.id,
        selectedIds: [...question.correctOptionIds],
        correct: true,
      })),
    }));
    setLocation("?branch=informal");

    const { container } = render(<App />);

    expect(container.querySelector('div[aria-label="第 6 题，共 9 题"]')).toBeTruthy();
    expect(screen.getByText(questions[5].prompt)).toBeTruthy();
    expect(container.querySelector(".result-score")).toBeNull();
  });
});

describe("review and mastery overview", () => {
  it("summarizes per-branch states and wrong totals on the landing page", () => {
    seedCompleteBranch("foundations");
    const informal = getQuestionsByBranch("informal");
    localStorage.setItem("logicPractice.progress", JSON.stringify({
      foundations: JSON.parse(localStorage.getItem("logicPractice.progress")!).foundations,
      informal: [
        { questionId: informal[0].id, selectedIds: ["b"], correct: false },
        { questionId: informal[1].id, selectedIds: [...informal[1].correctOptionIds], correct: true },
      ],
    }));

    const { container } = render(<App />);

    expect(container.textContent).toContain("已完成 1 / 10 个分支 · 待复习 1 道错题");
    expect(container.querySelector(".review-cta")?.textContent).toBe("复习 1 道错题");
    const rows = container.querySelectorAll(".branch-progress-list li");
    expect(rows).toHaveLength(10);
    expect(rows[0].textContent).toContain("逻辑基础");
    expect(rows[0].textContent).toContain("已完成 · 得分 4/4");
    expect(container.textContent).toContain("进行中 · 已答 2/9");
    expect(container.querySelectorAll(".branch-progress-state.is-not-started")).toHaveLength(8);
  });

  it("removes a question from review and updates the stored record after a correct answer", () => {
    const questions = getQuestionsByBranch("foundations");
    seedBranchWithWrongAt("foundations", 0);
    setLocation("?review=wrong");
    const review = render(<App />);

    // 队列只有这一道错题
    expect(review.container.querySelector('div[aria-label="第 1 题，共 1 题"]')).toBeTruthy();
    selectOption(review.container, questions[0].correctOptionIds[0]);
    fireEvent.click(screen.getByRole("button", { name: "提交答案" }));
    fireEvent.click(screen.getByRole("button", { name: "查看复习结果" }));

    expect(review.container.querySelector(".review-summary")?.textContent).toContain("1道已消除");
    expect(review.container.querySelector(".review-summary")?.textContent).toContain("0道仍待复习");
    expect(screen.queryByRole("button", { name: "再复习一遍" })).toBeNull();
    review.unmount();

    // 原答题记录被覆盖为正确答案
    const stored = JSON.parse(localStorage.getItem("logicPractice.progress")!);
    expect(stored.foundations[0]).toEqual({
      questionId: questions[0].id,
      selectedIds: [questions[0].correctOptionIds[0]],
      correct: true,
    });

    // 回到首页：没有待复习错题，分支恢复满分
    setLocation("");
    const landing = render(<App />);
    expect(landing.container.querySelector(".review-cta")).toBeNull();
    expect(landing.container.textContent).toContain("已完成 1 / 10 个分支 · 待复习 0 道错题");
    expect(landing.container.textContent).toContain("已完成 · 得分 4/4");
  });

  it("keeps a question pending when it is answered wrong again in review", () => {
    seedBranchWithWrongAt("foundations", 0);
    setLocation("?review=wrong");
    const { container } = render(<App />);

    const question = getQuestionsByBranch("foundations")[0];
    const wrongOptionId = question.options.map((option) => option.id).find((id) => !question.correctOptionIds.includes(id))!;
    selectOption(container, wrongOptionId);
    fireEvent.click(screen.getByRole("button", { name: "提交答案" }));
    fireEvent.click(screen.getByRole("button", { name: "查看复习结果" }));

    expect(container.querySelector(".review-summary")?.textContent).toContain("0道已消除");
    expect(container.querySelector(".review-summary")?.textContent).toContain("1道仍待复习");
    expect(screen.getByRole("button", { name: "再复习一遍" })).toBeTruthy();

    // 原记录保持不变
    const stored = JSON.parse(localStorage.getItem("logicPractice.progress")!);
    expect(stored.foundations[0]).toEqual({ questionId: question.id, selectedIds: ["b"], correct: false });
  });

  it("explains the empty state when there is nothing to review", () => {
    setLocation("?review=wrong");
    const { container } = render(<App />);
    expect(container.querySelector(".review-empty")).toBeTruthy();
    expect(screen.getByText("当前没有待复习的错题")).toBeTruthy();
    expect(screen.getByRole("link", { name: "返回全部分支" })).toBeTruthy();
  });

  it("ignores corrupted or mismatched old records in the overview", () => {
    localStorage.setItem("logicPractice.progress", JSON.stringify({
      foundations: [{ questionId: "ghost", selectedIds: [], correct: false }],
      informal: "not-an-array",
    }));

    const { container } = render(<App />);

    expect(container.querySelector(".review-cta")).toBeNull();
    expect(container.textContent).toContain("已完成 0 / 10 个分支 · 待复习 0 道错题");
    expect(container.textContent).toContain("暂无待复习的错题");
    expect(container.querySelectorAll(".branch-progress-list li")).toHaveLength(10);
  });

  it("returns a branch to not-started in the overview after restarting it", () => {
    seedCompleteBranch("foundations");
    setLocation("?branch=foundations");
    const session = render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "重新练习本分支" }));
    session.unmount();

    setLocation("");
    const { container } = render(<App />);
    expect(container.textContent).toContain("已完成 0 / 10 个分支");
    expect(container.querySelectorAll(".branch-progress-state.is-not-started")).toHaveLength(10);
  });
});

describe("submit-and-exit persistence", () => {
  it("saves a normal answer on submit even when leaving before advancing", () => {
    const branch = branches[0];
    const questions = getQuestionsByBranch(branch.id);
    setLocation(`?branch=${branch.id}`);
    const session = render(<App />);

    const question = questions[0];
    const wrongOptionId = question.options.map((option) => option.id).find((id) => !question.correctOptionIds.includes(id))!;
    selectOption(session.container, wrongOptionId);
    fireEvent.click(screen.getByRole("button", { name: "提交答案" }));
    session.unmount(); // 不点“下一题”直接退出

    setLocation("");
    const landing = render(<App />);
    expect(landing.container.textContent).toContain(`进行中 · 已答 1/${questions.length}`);
    expect(landing.container.textContent).toContain("待复习 1 道错题");
    expect(landing.container.querySelector(".review-cta")?.textContent).toBe("复习 1 道错题");
  });

  it("saves the final answer on submit so the landing page shows completion", () => {
    const branch = branches[0];
    const questions = getQuestionsByBranch(branch.id);
    setLocation(`?branch=${branch.id}`);
    const session = render(<App />);

    for (const [offset, question] of questions.entries()) {
      for (const optionId of question.correctOptionIds) selectOption(session.container, optionId);
      fireEvent.click(screen.getByRole("button", { name: "提交答案" }));
      if (offset < questions.length - 1) {
        fireEvent.click(screen.getByRole("button", { name: "下一题" }));
      }
    }
    session.unmount(); // 最后一题后不点“查看本次结果”直接退出

    setLocation("");
    const landing = render(<App />);
    expect(landing.container.textContent).toContain(`已完成 · 得分 ${questions.length}/${questions.length}`);
    expect(landing.container.textContent).toContain("待复习 0 道错题");
  });

  it("updates the stored record immediately after a correct review answer", () => {
    const questions = getQuestionsByBranch("foundations");
    seedBranchWithWrongAt("foundations", 0);
    setLocation("?review=wrong");
    const review = render(<App />);

    selectOption(review.container, questions[0].correctOptionIds[0]);
    fireEvent.click(screen.getByRole("button", { name: "提交答案" }));
    review.unmount(); // 不点“查看复习结果”直接退出

    // 原记录在提交时已被覆盖为正确
    const stored = JSON.parse(localStorage.getItem("logicPractice.progress")!);
    expect(stored.foundations[0]).toEqual({
      questionId: questions[0].id,
      selectedIds: [...questions[0].correctOptionIds],
      correct: true,
    });

    setLocation("");
    const landing = render(<App />);
    expect(landing.container.textContent).toContain("待复习 0 道错题");
    expect(landing.container.textContent).toContain("已完成 · 得分 4/4");
    expect(landing.container.querySelector(".review-cta")).toBeNull();
  });
});
