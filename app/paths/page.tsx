import type { Metadata } from "next";
import Link from "next/link";
import { getEntry, learningPaths } from "../../lib/catalog";

export const metadata: Metadata = {
  title: "学习路径",
  description: `${learningPaths.length} 条面向不同学习目标的逻辑学入门路径。`,
};

export default function PathsPage() {
  return (
    <main id="main-content" className="page-shell shell">
      <header className="page-header">
        <p className="eyebrow">按目标学习</p>
        <h1>{learningPaths.length} 条路径，把分散条目连成一次学习</h1>
        <p>每条路径按起点、核心、延伸与整合四个阶段组织。先完成一条，再决定是否进入更形式化或更现实的问题。</p>
      </header>
      <div className="paths-index">
        {learningPaths.map((path, index) => (
          <article key={path.slug}>
            <div className="paths-index-heading">
              <span>0{index + 1}</span>
              <div><small>{path.level} · {path.steps.length} 步</small><h2>{path.title}</h2><p>{path.summary}</p></div>
            </div>
            <ol>
              {path.steps.map((step) => <li key={step.entrySlug}><span>{step.stage}</span><strong>{getEntry(step.entrySlug)?.title}</strong></li>)}
            </ol>
            <Link className="text-action" href={`/paths/${path.slug}`}>进入这条路径</Link>
          </article>
        ))}
      </div>
    </main>
  );
}
