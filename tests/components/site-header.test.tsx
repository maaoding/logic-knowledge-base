// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { SiteHeader } from "../../components/site-header";

beforeEach(() => {
  document.documentElement.dataset.theme = "light";
  localStorage.clear();
});

afterEach(() => cleanup());

function renderHeader() {
  return render(<SiteHeader searchCount={149} practiceUrl="http://localhost:3001/" />);
}

function dialogOpen() {
  return (document.querySelector("dialog.search-dialog") as HTMLDialogElement | null)?.open ?? false;
}

describe("site header", () => {
  it("toggles the mobile navigation and collapses sibling dropdown groups", () => {
    const { container } = renderHeader();

    const menuButton = screen.getByRole("button", { name: "目录" });
    expect(menuButton.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(menuButton);
    expect(screen.getByRole("button", { name: "收起" }).getAttribute("aria-expanded")).toBe("true");

    const formal = screen.getByRole("button", { name: "形式逻辑" });
    expect(formal.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(formal);
    expect(formal.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("link", { name: "传统逻辑" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "推理与论证" }));
    expect(formal.getAttribute("aria-expanded")).toBe("false");
    expect(screen.getByRole("link", { name: "归纳逻辑" })).toBeTruthy();
    expect(container.querySelector(".site-navigation")?.className).toContain("is-open");
  });

  it("opens the search dialog from the toolbar and closes it from the dialog button", () => {
    renderHeader();
    expect(dialogOpen()).toBe(false);

    fireEvent.click(screen.getByRole("button", { name: /搜索/ }));
    expect(dialogOpen()).toBe(true);
    expect(screen.getByText(/搜索覆盖 149 项本地内容/)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "关闭搜索" }));
    expect(dialogOpen()).toBe(false);
  });

  it("opens search with the slash shortcut and closes it with Escape inside the dialog", () => {
    renderHeader();
    // 键盘事件派发到 body：window 上的监听能收到，且 target 有 .matches 方法
    fireEvent.keyDown(document.body, { key: "/" });
    expect(dialogOpen()).toBe(true);

    fireEvent.keyDown(document.querySelector(".search-field input") as HTMLElement, { key: "Escape" });
    expect(dialogOpen()).toBe(false);
  });

  it("links the practice site with the provided url", () => {
    renderHeader();
    const link = screen.getByRole("link", { name: "练习站" }) as HTMLAnchorElement;
    expect(link.href).toBe("http://localhost:3001/");
  });
});
