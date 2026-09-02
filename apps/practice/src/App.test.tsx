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

  it("finishes a full branch question set, reviews it, and restarts without persisted answers", () => {
    const branch = branches[1];
    const questions = getQuestionsByBranch(branch.id);
    setLocation(`?branch=${branch.id}`);
    const firstRender = render(<App />);

    for (const [index, question] of questions.entries()) {
      for (const optionId of question.correctOptionIds) selectOption(firstRender.container, optionId);
      fireEvent.click(screen.getByRole("button", { name: "提交答案" }));
      fireEvent.click(screen.getByRole("button", { name: index === questions.length - 1 ? "查看本次结果" : "下一题" }));
    }

    expect(screen.getByText(`/ ${questions.length}`)).toBeTruthy();
    expect(screen.getAllByRole("link", { name: "阅读对应知识条目" })).toHaveLength(questions.length);
    fireEvent.click(screen.getByRole("button", { name: "重新练习本分支" }));
    expect(screen.getByRole("button", { name: "提交答案" })).toHaveProperty("disabled", true);

    selectOption(firstRender.container, questions[0].correctOptionIds[0]);
    fireEvent.click(screen.getByRole("button", { name: "提交答案" }));
    expect(screen.getByRole("status")).toBeTruthy();
    firstRender.unmount();
    render(<App />);
    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.getByRole("button", { name: "提交答案" })).toHaveProperty("disabled", true);
  });
});
