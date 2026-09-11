// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { knowledgeEntries } from "../../lib/catalog";
import { EntryView } from "../../components/entry-view";

afterEach(() => cleanup());

function entryBySlug(slug: string) {
  const entry = knowledgeEntries.find((candidate) => candidate.slug === slug);
  if (!entry) throw new Error(`Missing fixture entry ${slug}`);
  return entry;
}

describe("entry view", () => {
  it("renders the core-entry template with relations and a practice link", () => {
    const entry = entryBySlug("truth-validity-soundness");
    const { container } = render(<EntryView entry={entry} />);

    expect(screen.getByText("学习路径核心条目")).toBeTruthy();
    expect(screen.getByLabelText("一句话结论")).toBeTruthy();
    // 区块的可访问名来自 aria-labelledby 指向的标题，眉标用文本断言
    expect(screen.getByText("学习目标")).toBeTruthy();
    expect(screen.getByText("逐步例题")).toBeTruthy();
    expect(screen.getByText("常见误区")).toBeTruthy();
    expect(screen.getByText("快速自测")).toBeTruthy();

    const practiceLink = screen.getByRole("link", { name: "去练习站检验本分支" }) as HTMLAnchorElement;
    expect(practiceLink.href).toBe("http://localhost:3001/?branch=foundations");

    const prerequisiteSection = screen.getByRole("heading", { name: "前置知识" }).closest("section");
    expect(prerequisiteSection?.querySelectorAll("a").length).toBeGreaterThan(0);

    if (entry.formulas?.length) {
      expect(container.querySelector(".logic-formula .katex")).toBeTruthy();
    }
  });

  it("marks non-core entries as extended topics without breaking missing optional blocks", () => {
    const entry = entryBySlug("mohist-logic");
    const { container } = render(<EntryView entry={entry} />);

    expect(screen.getByText("专题延伸条目")).toBeTruthy();
    expect(container.textContent).toContain("本条目属于专题延伸");
    // 面包屑回到所属分支（同名链接在侧栏「所属分支」还有一处，需限定范围）
    const breadcrumbs = screen.getByRole("navigation", { name: "面包屑" });
    expect(within(breadcrumbs).getByRole("link", { name: "逻辑学史" })).toBeTruthy();
  });
});
