import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  branches,
  entryPath,
  getBranch,
  getEntriesByBranch,
  isCoreEntry,
  learningPaths,
} from "../../../lib/catalog";
import { textOnlyDetailMetadata } from "../../../lib/metadata";
import { practiceSiteUrl } from "../../../lib/site-links";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return branches.map((branch) => ({ slug: branch.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const branch = getBranch(slug);
  return branch ? textOnlyDetailMetadata(branch.title, branch.summary) : {};
}

export default async function BranchPage({ params }: Props) {
  const { slug } = await params;
  const branch = getBranch(slug);
  if (!branch) notFound();
  const entries = getEntriesByBranch(branch.id);
  const relatedPaths = learningPaths.filter((path) =>
    path.steps.some((step) => entries.some((entry) => entry.slug === step.entrySlug)),
  );

  return (
    <main id="main-content" className="page-shell shell">
      <nav className="breadcrumbs" aria-label="面包屑">
        <Link href="/">首页</Link><span aria-hidden="true">/</span><span aria-current="page">{branch.title}</span>
      </nav>
      <header className="branch-header">
        <div>
          <p className="eyebrow">{branch.group} · {branch.level}</p>
          <h1>{branch.title}</h1>
          <p>{branch.summary}</p>
        </div>
        <span className="branch-header-symbol" aria-hidden="true">{branch.symbol}</span>
      </header>

      <section className="branch-entry-section" aria-labelledby="branch-entries-title">
        <div className="section-heading">
          <div><p className="eyebrow">知识目录</p><h2 id="branch-entries-title">本分支条目</h2></div>
          <p>当前收录 {entries.length} 个条目；学习路径成员会标注为核心内容。</p>
        </div>
        <div className="branch-entry-list">
          {entries.map((entry, index) => (
            <Link href={entryPath(entry)} key={entry.slug}>
              <span className="entry-number">{String(index + 1).padStart(2, "0")}</span>
              <div><small>{entry.difficulty} · {isCoreEntry(entry.slug) ? "路径核心" : "参考条目"} · {entry.tags.slice(0, 2).join(" / ")}</small><h3>{entry.title}</h3><p>{entry.summary}</p></div>
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="branch-practice" aria-labelledby="branch-practice-title">
        <div>
          <p className="eyebrow">分支练习</p>
          <h2 id="branch-practice-title">完成本分支练习，检验理解</h2>
          <p>答题进度只保存在当前浏览器本地，完成后可逐题返回对应知识条目。</p>
        </div>
        <a href={practiceSiteUrl(branch.id)}>练习本分支</a>
      </section>

      {relatedPaths.length ? (
        <section className="branch-paths" aria-labelledby="branch-paths-title">
          <div className="section-heading"><div><p className="eyebrow">继续学习</p><h2 id="branch-paths-title">包含本分支的路径</h2></div></div>
          <div className="mini-paths">
            {relatedPaths.map((path) => <Link href={`/paths/${path.slug}`} key={path.slug}><strong>{path.title}</strong><span>{path.steps.length} 步 · {path.level}</span></Link>)}
          </div>
        </section>
      ) : null}
    </main>
  );
}
