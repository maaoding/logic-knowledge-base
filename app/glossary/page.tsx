import type { Metadata } from "next";
import Link from "next/link";
import { entryPath, getEntry } from "../../lib/catalog";
import { glossaryIntro, glossaryTermId, glossaryTerms } from "../../lib/content/glossary";

export const metadata: Metadata = {
  title: "术语表",
  description: "按拼音顺序排列的逻辑学常用术语速查，每条附易混提示与正文条目链接。",
};

const unknownSlugs = glossaryTerms.flatMap((term) =>
  term.seeAlso.filter((slug) => !getEntry(slug)),
);
if (unknownSlugs.length) {
  throw new Error(`Glossary references unknown entries: ${unknownSlugs.join(", ")}`);
}

export default function GlossaryPage() {
  return (
    <main id="main-content" className="page-shell shell">
      <header className="page-header">
        <p className="eyebrow">速查</p>
        <h1>术语表</h1>
        <p>{glossaryIntro}</p>
      </header>

      <nav className="term-index" aria-label="术语索引">
        {glossaryTerms.map((term) => (
          <a key={term.term} href={`#${glossaryTermId(term)}`}>{term.term}</a>
        ))}
      </nav>

      <div className="term-list">
        {glossaryTerms.map((term) => (
          <article className="term-item" key={term.term} id={glossaryTermId(term)}>
            <h2>
              {term.term}
              {term.aliases?.length ? <small>（{term.aliases.join("、")}）</small> : null}
            </h2>
            <p>{term.definition}</p>
            {term.confusion ? <p className="term-confusion"><strong>易混提示：</strong>{term.confusion}</p> : null}
            {term.seeAlso.length ? (
              <p className="term-links">
                详见：
                {term.seeAlso.map((slug, linkIndex) => {
                  const entry = getEntry(slug);
                  if (!entry) return null;
                  return (
                    <span key={slug}>
                      {linkIndex > 0 ? "、" : ""}
                      <Link href={entryPath(entry)}>{entry.title}</Link>
                    </span>
                  );
                })}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </main>
  );
}
