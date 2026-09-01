import type { Metadata } from "next";
import Link from "next/link";
import { branches, learningPaths, referenceSections } from "../../lib/catalog";

export const metadata: Metadata = {
  title: "从这里开始",
  description: "零基础读者进入逻辑学知识库的使用说明与推荐起点。",
};

export default function StartPage() {
  return (
    <main id="main-content" className="page-shell shell">
      <header className="page-header start-header">
        <p className="eyebrow">零基础入口</p>
        <h1>先学会看见论证，再选择一条分支</h1>
        <p>
          逻辑学不是背诵符号。第一步是分清一个人主张了什么、给了哪些理由，以及这些理由是否真的支持结论。
        </p>
      </header>

      <section className="start-steps" aria-labelledby="start-steps-title">
        <h2 id="start-steps-title">建议按三步使用</h2>
        <ol>
          <li>
            <span>01</span>
            <div><strong>先读两个基础条目</strong><p>从论证结构开始，再区分真值、有效性和健全性。</p></div>
          </li>
          <li>
            <span>02</span>
            <div><strong>选一条完整路径</strong><p>路径把条目按学习目的排序，避免在术语之间随机跳转。</p></div>
          </li>
          <li>
            <span>03</span>
            <div><strong>带着练习回到现实</strong><p>核心条目提供例题与解析，独立练习站则按分支检验理解。</p></div>
          </li>
        </ol>
      </section>

      <section className="start-choice" aria-labelledby="start-choice-title">
        <div className="section-heading">
          <div><p className="eyebrow">两种起点</p><h2 id="start-choice-title">按目标选择，不按难度焦虑</h2></div>
        </div>
        <div className="start-choice-grid">
          <Link href="/paths/argument-to-validity">
            <span>想知道推理是否成立</span>
            <strong>从论证到有效性</strong>
            <p>适合第一次系统接触逻辑学。</p>
          </Link>
          <Link href="/paths/induction-and-real-arguments">
            <span>想分析新闻与讨论</span>
            <strong>归纳与现实论证</strong>
            <p>适合把逻辑工具用于自然语言。</p>
          </Link>
        </div>
      </section>

      <section className="start-reference" aria-labelledby="start-reference-title">
        <div className="section-heading">
          <div><p className="eyebrow">卡住时这样查</p><h2 id="start-reference-title">先定位问题，再选择工具</h2></div>
          <p>这些栏目不会替你安排新的学习路径，只在需要时提供更短的入口。</p>
        </div>
        <div className="reference-grid">
          {referenceSections.map((section) => (
            <Link className="reference-card" href={section.href} key={section.href}>
              <span className="reference-count">{section.countLabel}</span>
              <div>
                <h3>{section.title}</h3>
                <p>{section.useWhen}</p>
              </div>
              <span className="reference-action">查看</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="compact-map" aria-labelledby="all-branches-title">
        <div className="section-heading linked-heading">
          <div><p className="eyebrow">完整体系</p><h2 id="all-branches-title">十个分支，分层呈现</h2></div>
          <Link href={`/paths/${learningPaths[0].slug}`}>开始第一条路径</Link>
        </div>
        <div className="compact-map-list">
          {branches.map((branch) => (
            <Link href={`/branches/${branch.id}`} key={branch.id}>
              <span>{branch.symbol}</span><strong>{branch.title}</strong><small>{branch.group}</small>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
