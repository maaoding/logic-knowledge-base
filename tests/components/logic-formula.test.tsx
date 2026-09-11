// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { LogicFormula } from "../../components/logic-formula";

afterEach(() => cleanup());

// render 与断言共用同一常量，避免手工转义层数不一致
const equivalenceTex = "P \\to Q \\equiv \\neg P \\lor Q";

describe("logic formula", () => {
  it("renders KaTeX output with an accessible region and caption", () => {
    render(<LogicFormula tex={equivalenceTex} label="实质条件句等值式" />);

    const region = screen.getByRole("region", { name: "公式：实质条件句等值式" });
    expect(region.getAttribute("tabindex")).toBe("0");
    // HTML 与 MathML 双输出都应存在，MathML annotation 原样保留输入的 tex
    expect(region.querySelector(".katex-html")).toBeTruthy();
    const annotation = region.querySelector("annotation[encoding='application/x-tex']");
    expect(annotation?.textContent).toBe(equivalenceTex);
    expect(screen.getByText("实质条件句等值式").tagName).toBe("FIGCAPTION");
  });

  it("keeps inline formulas without display blocks when display is false", () => {
    const { container } = render(<LogicFormula tex="\\neg P" label="否定" display={false} />);
    expect(container.querySelector(".katex-display")).toBeNull();
    expect(container.querySelector(".katex")).toBeTruthy();
  });
});
