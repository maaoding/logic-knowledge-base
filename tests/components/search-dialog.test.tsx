// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SearchDialog } from "../../components/search-dialog";

beforeEach(() => {
  document.documentElement.dataset.theme = "light";
});

afterEach(() => cleanup());

function renderOpen(onClose = vi.fn()) {
  render(<SearchDialog searchCount={135} open onClose={onClose} />);
  return onClose;
}

describe("search dialog", () => {
  it("opens as a modal, focuses the input and announces the local catalog count", async () => {
    renderOpen();
    const dialog = document.querySelector("dialog.search-dialog") as HTMLDialogElement | null;
    expect(dialog?.open).toBe(true);
    await waitFor(() => expect(document.activeElement).toBe(document.querySelector(".search-field input")));
    expect(screen.getByText(/搜索覆盖 135 项本地内容/)).toBeTruthy();
  });

  it("filters records and moves the highlight with arrow keys before Enter closes via the result link", async () => {
    const onClose = renderOpen();
    const input = screen.getByRole("combobox") as HTMLInputElement;
    await waitFor(async () => {
      fireEvent.change(input, { target: { value: "归纳" } });
      expect(document.querySelectorAll("#search-results-listbox [role=option]").length).toBeGreaterThan(0);
    });
    expect(document.querySelectorAll("#search-results-listbox [role=option]").length).toBe(10);
    // 标题命中的（含术语「归纳」）排在仅摘要命中的（如「类比论证」）之前
    const titles = [...document.querySelectorAll("#search-results-listbox [role=option] strong")].map((el) => el.textContent);
    expect(titles.indexOf("归纳")).toBeGreaterThan(-1);
    expect(titles.indexOf("归纳")).toBeLessThan(titles.indexOf("类比论证"));

    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input.getAttribute("aria-activedescendant")).toBe("search-option-1");
    expect(document.querySelector("#search-results-listbox [aria-selected=true] strong")?.textContent).toContain("归纳强度");

    fireEvent.keyDown(input, { key: "Enter" });
    expect(onClose).toHaveBeenCalled();
  });

  it("suggests nearby records when the query matches nothing directly", async () => {
    renderOpen();
    const input = screen.getByRole("combobox") as HTMLInputElement;
    await waitFor(() => expect(screen.queryByText(/正在加载本地目录/)).toBeNull());
    fireEvent.change(input, { target: { value: "真值函数讲义" } });
    expect(screen.getByText(/没有找到匹配条目/)).toBeTruthy();
    const suggestions = await screen.findAllByText("真值函数");
    expect(suggestions.length).toBeGreaterThan(0);
    expect(screen.getByText(/是否在找/)).toBeTruthy();
  });
});
