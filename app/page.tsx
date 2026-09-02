import Link from "next/link";
import { practiceQuestions } from "@logic/domain";
import {
  branches,
  entryPath,
  knowledgeEntries,
  learningPaths,
  referenceSections,
} from "../lib/catalog";
import { practiceSiteUrl } from "../lib/site-links";

const groupOrder = ["起点", "形式逻辑", "推理与论证", "进阶逻辑", "多文明逻辑史"] as const;

export default function Home() {
  const featuredEntries = knowledgeEntries
    .filter((entry) => entry.featuredOrder)
    .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0));

  return (
    <main id="main-content">
      <section className="home-hero shell" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="knowledge-label">{knowledgeEntries.length} 个知识条目 · {practiceQuestions.length} 道分支练习</p>
          <p className="eyebrow">从论证到证明</p>
          <h1 id="home-title">为零基础读者展开一张逻辑地图</h1>
          <p className="hero-lead">
            先看清前提如何支持结论，再进入形式系统、现实论证与逻辑的多文明历史。这里不是术语仓库，而是一组可以继续行走的关系。
          </p>
          <div className="hero-actions">
            <Link className="primary-action" href="/start">从这里开始</Link>
            <Link className="text-action" href="/paths">查看 {learningPaths.length} 条学习路径</Link>
          </div>
        </div>

        <div className="hero-proof" aria-label="由前提通往结论的论证结构示意">
          <div className="proof-row">
            <span>P₁</span>
            <p>所有有效推理都保持真</p>
          </div>
          <div className="proof-row">
            <span>P₂</span>
            <p>这一步没有前真结假的情形</p>
          </div>
          <div className="proof-divider"><span>因此</span></div>
          <div className="proof-row proof-conclusion">
            <span>C</span>
            <p>结论由前提必然推出</p>
          </div>
          <div className="proof-symbols" aria-hidden="true">¬ ∧ ∨ → ∀ ∃ ⊢ ⊨</div>
        </div>
      </section>

      <nav className="home-stats shell" aria-label="知识库概览">
        <Link href="#knowledge-map"><strong>{branches.length}</strong><span>学科分支</span></Link>
        <Link href="#recommended-entries"><strong>{knowledgeEntries.length}</strong><span>知识条目</span></Link>
        <Link href="/paths"><strong>{learningPaths.length}</strong><span>学习路径</span></Link>
        <Link href="/branches/history"><strong>4</strong><span>逻辑史传统</span></Link>
      </nav>

      <section id="knowledge-map" className="home-section shell" aria-labelledby="map-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">学科地图</p>
            <h2 id="map-title">从共同基础，走向不同问题</h2>
          </div>
          <p>分组呈现完整学院体系，进阶分支不会阻挡初学者的起点。</p>
        </div>

        <div className="knowledge-map">
          {groupOrder.map((group, groupIndex) => (
            <section className="map-row" key={group} aria-labelledby={`group-${groupIndex}`}>
              <div className="map-row-heading">
                <span>{String(groupIndex + 1).padStart(2, "0")}</span>
                <h3 id={`group-${groupIndex}`}>{group}</h3>
              </div>
              <div className="map-branches">
                {branches.filter((branch) => branch.group === group).map((branch) => (
                  <Link href={`/branches/${branch.id}`} key={branch.id}>
                    <span className="branch-symbol">{branch.symbol}</span>
                    <strong>{branch.title}</strong>
                    <p>{branch.summary}</p>
                    <small>{branch.level}</small>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="home-section home-paths shell" aria-labelledby="paths-title">
        <div className="section-heading linked-heading">
          <div>
            <p className="eyebrow">学习路径</p>
            <h2 id="paths-title">不必一次理解整张地图</h2>
          </div>
          <Link href="/paths">查看路径详情</Link>
        </div>
        <div className="path-list">
          {learningPaths.map((path, index) => (
            <Link className="path-row" href={`/paths/${path.slug}`} key={path.slug}>
              <span className="path-index">0{index + 1}</span>
              <div>
                <span className="path-level">{path.level}</span>
                <h3>{path.title}</h3>
                <p>{path.summary}</p>
              </div>
              <span className="path-count">{path.steps.length} 步</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="recommended-entries" className="home-section shell" aria-labelledby="recommended-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">推荐条目</p>
            <h2 id="recommended-title">从几个关键节点进入知识网络</h2>
          </div>
          <p>先建立论证与有效性的共同语言，再按兴趣进入形式系统、现实推理或逻辑史。</p>
        </div>
        <div className="featured-list">
          {featuredEntries.map((entry, index) => (
            <Link href={entryPath(entry)} key={entry.slug}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>{entry.title}</strong>
                <p>{entry.summary}</p>
              </div>
              <small>{entry.difficulty}</small>
            </Link>
          ))}
        </div>
      </section>

      <section id="reference-tools" className="home-section shell" aria-labelledby="reference-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">查阅与应用</p>
            <h2 id="reference-title">卡住时，不必从头重读</h2>
          </div>
          <p>按问题选择速查、对照、案例或外部资源，让阅读和应用之间保持一条短路。</p>
        </div>
        <div className="reference-grid">
          {referenceSections.map((section) => (
            <Link className="reference-card" href={section.href} key={section.href}>
              <span className="reference-count">{section.countLabel}</span>
              <div>
                <h3>{section.title}</h3>
                <p>{section.summary}</p>
              </div>
              <span className="reference-action">打开</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="practice-invite shell" aria-label="分支练习站入口">
        <strong>读完之后，做一组题。</strong>
        <p>练习站按十个学科分支组织，每篇知识条目至少对应一题，提交后立即给出解析与知识条目入口。</p>
        <a href={practiceSiteUrl()}>进入分支练习站</a>
      </section>
    </main>
  );
}
