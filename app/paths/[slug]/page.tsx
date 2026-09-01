import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { entryPath, getEntry, getLearningPath, learningPaths } from "../../../lib/catalog";
import { textOnlyDetailMetadata } from "../../../lib/metadata";
import { practiceSiteUrl } from "../../../lib/site-links";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return learningPaths.map((path) => ({ slug: path.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const path = getLearningPath(slug);
  return path ? textOnlyDetailMetadata(path.title, path.summary) : {};
}

export default async function LearningPathPage({ params }: Props) {
  const { slug } = await params;
  const path = getLearningPath(slug);
  if (!path) notFound();

  return (
    <main id="main-content" className="page-shell shell path-detail">
      <nav className="breadcrumbs" aria-label="面包屑">
        <Link href="/">首页</Link><span aria-hidden="true">/</span><Link href="/paths">学习路径</Link><span aria-hidden="true">/</span><span aria-current="page">{path.title}</span>
      </nav>
      <header className="page-header">
        <p className="eyebrow">{path.level} · {path.steps.length} 步</p>
        <h1>{path.title}</h1>
        <p>{path.summary}</p>
      </header>
      {path.foundationSlugs.length ? (
        <section className="path-foundations" aria-labelledby="path-foundations-title">
          <div>
            <p className="eyebrow">前置知识</p>
            <h2 id="path-foundations-title">开始前建议</h2>
            {path.foundationNote ? <p>{path.foundationNote}</p> : null}
          </div>
          <ul>
            {path.foundationSlugs.map((foundationSlug) => {
              const entry = getEntry(foundationSlug);
              if (!entry) return null;
              return <li key={foundationSlug}><Link href={entryPath(entry)}>{entry.title}</Link></li>;
            })}
          </ul>
        </section>
      ) : null}
      <ol className="path-steps">
        {path.steps.map((step, index) => {
          const entry = getEntry(step.entrySlug);
          if (!entry) return null;
          return (
            <li key={step.entrySlug}>
              <span className="step-number">{String(index + 1).padStart(2, "0")}</span>
              <div><small>{step.stage}</small><h2>{entry.title}</h2><p>{step.goal}</p><span>{entry.summary}</span></div>
              <Link href={entryPath(entry)}>阅读条目</Link>
            </li>
          );
        })}
      </ol>
      <section className="practice-invite" aria-label="完成路径后的练习建议">
        <strong>完成路径后，回到分支检验。</strong>
        <p>练习站不记录进度；你可以选择路径涉及的任一分支完成三道题，并从解析返回知识条目。</p>
        <a href={practiceSiteUrl()}>选择练习分支</a>
      </section>
    </main>
  );
}
