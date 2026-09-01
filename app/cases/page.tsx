import type { Metadata } from "next";
import { casesIntro, argumentCases } from "../../lib/content/cases";
import { entryPath, getEntry } from "../../lib/catalog";
import Link from "next/link";

export const metadata: Metadata = {
  title: "论证分析案例",
  description: "用重构、形式检验与证据评估三种透镜轮流拆解真实感论证。",
};

const unknownSlugs = argumentCases.flatMap((argumentCase) =>
  argumentCase.lenses.map((lens) => lens.entrySlug).filter((slug) => slug && !getEntry(slug)),
);
if (unknownSlugs.length) {
  throw new Error(`Cases reference unknown entries: ${unknownSlugs.join(", ")}`);
}

export default function CasesPage() {
  return (
    <main id="main-content" className="page-shell shell">
      <header className="page-header">
        <p className="eyebrow">应用</p>
        <h1>论证分析案例</h1>
        <p>{casesIntro}</p>
      </header>

      <div className="case-list">
        {argumentCases.map((argumentCase) => (
          <article className="case-item" key={argumentCase.slug} id={argumentCase.slug}>
            <header>
              <h2>{argumentCase.title}</h2>
              <p className="case-source">{argumentCase.source}</p>
            </header>
            <blockquote className="case-text">{argumentCase.text}</blockquote>
            {argumentCase.lenses.map((lens) => (
              <section className="case-lens" key={lens.heading}>
                <h3>
                  {lens.heading}
                  {lens.entrySlug ? (() => {
                    const entry = getEntry(lens.entrySlug);
                    return entry ? <Link href={entryPath(entry)}>相关条目：{entry.title}</Link> : null;
                  })() : null}
                </h3>
                {lens.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </section>
            ))}
            <section className="case-questions" aria-label="追问清单">
              <h3>继续追问</h3>
              <ul>
                {argumentCase.questions.map((question) => <li key={question}>{question}</li>)}
              </ul>
            </section>
          </article>
        ))}
      </div>
    </main>
  );
}
