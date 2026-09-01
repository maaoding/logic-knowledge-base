/* eslint-disable jsx-a11y/no-noninteractive-tabindex -- Overflowing formulas need a keyboard-focusable scroll region. */
import katex from "katex";

export function LogicFormula({ tex, label, display = true }: { tex: string; label: string; display?: boolean }) {
  const html = katex.renderToString(tex, {
    displayMode: display,
    output: "htmlAndMathml",
    strict: "warn",
    throwOnError: true,
    trust: false,
  });

  return (
    <figure className="logic-formula">
      <div
        className="logic-formula-scroll"
        role="region"
        aria-label={`公式：${label}`}
        tabIndex={0}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <figcaption>{label}</figcaption>
    </figure>
  );
}
