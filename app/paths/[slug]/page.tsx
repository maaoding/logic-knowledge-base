import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import {
  entryPath,
  getBranch,
  getCompanionGroupsForEntry,
  getEntry,
  getLearningPath,
  getPathBranchIds,
  learningPaths,
} from "../../../lib/catalog";
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

  const companionSteps = path.steps
    .map((step) => {
      const entry = getEntry(step.entrySlug);
      return entry ? { step, entry, groups: getCompanionGroupsForEntry(step.entrySlug) } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null && item.groups.length > 0);
  const pathBranchIds = getPathBranchIds(path);

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
      {companionSteps.length ? (
        <section className="path-companions" aria-labelledby="path-companions-title">
          <div>
            <p className="eyebrow">配套速查</p>
            <h2 id="path-companions-title">每个步骤的对照、案例与术语</h2>
            <p>学到某一步卡住时，先查易混对照和相关术语；想看这些工具如何用在完整论证上，再打开案例。</p>
          </div>
          <ul>
            {companionSteps.map(({ step, entry, groups }, index) => (
              <li key={step.entrySlug}>
                <strong>{String(index + 1).padStart(2, "0")} · {entry.title}</strong>
                {groups.map((group) => (
                  <p className="companion-row" key={group.kind}>
                    <span className="companion-kind">{group.kind}</span>
                    {group.links.map((link, linkIndex) => (
                      <Fragment key={link.href}>
                        {linkIndex > 0 ? <span aria-hidden="true"> · </span> : null}
                        <Link href={link.href}>{link.label}</Link>
                      </Fragment>
                    ))}
                  </p>
                ))}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <section className="practice-invite" aria-label="完成路径后的练习建议">
        <strong>完成路径后，回到分支检验。</strong>
        <p>路径条目分布在下列练习分支；进度只保存在当前浏览器本地，并可从解析返回知识条目。</p>
        <div className="practice-invite-links">
          {pathBranchIds.map((branchId) => {
            const branch = getBranch(branchId);
            return branch ? <a key={branchId} href={practiceSiteUrl(branchId)}>练习{branch.title}</a> : null;
          })}
        </div>
      </section>
    </main>
  );
}
