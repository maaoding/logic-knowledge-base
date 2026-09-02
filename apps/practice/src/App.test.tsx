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
