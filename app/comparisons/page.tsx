import type { Metadata } from "next";
import Link from "next/link";
import { entryPath, getEntry } from "../../lib/catalog";
import { comparisonsIntro, conceptComparisons } from "../../lib/content/comparisons";

export const metadata: Metadata = {
  title: "易混概念对照",
  description: "成对逻辑概念的共同点、关键差异与最易混淆的真实场景。",
};

const unknownSlugs = conceptComparisons.flatMap((comparison) =>
  [comparison.left.entrySlug, comparison.right.entrySlug].filter((slug) => !getEntry(slug)),
);
if (unknownSlugs.length) {
  throw new Error(`Comparisons reference unknown entries: ${unknownSlugs.join(", ")}`);
}

export default function ComparisonsPage() {
  return (
    <main id="main-content" className="page-shell shell">
      <header className="page-header">
        <p className="eyebrow">对照</p>
        <h1>易混概念对照</h1>
        <p>{comparisonsIntro}</p>
      </header>

      <div className="comparison-list">
        {conceptComparisons.map((comparison) => {
          const left = getEntry(comparison.left.entrySlug);
          const right = getEntry(comparison.right.entrySlug);
          return (
            <article className="comparison-item" key={comparison.slug} id={comparison.slug} aria-labelledby={`${comparison.slug}-title`}>
              <h2 className="comparison-pair" id={`${comparison.slug}-title`}>
                <Link href={left ? entryPath(left) : "#"}><strong>{comparison.left.label}</strong></Link>
                <span aria-hidden="true">vs</span>
                <span className="sr-only">与</span>
                <Link href={right ? entryPath(right) : "#"}><strong>{comparison.right.label}</strong></Link>
              </h2>
              <dl>
                <div>
                  <dt>共同点</dt>
                  <dd>{comparison.shared}</dd>
                </div>
                <div>
                  <dt>关键差异</dt>
                  <dd>{comparison.difference}</dd>
                </div>
                <div>
                  <dt>易混场景</dt>
                  <dd>{comparison.watch}</dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>
    </main>
  );
}
