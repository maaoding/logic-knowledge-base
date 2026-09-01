import Link from "next/link";
import {
  entryPath,
  getBranch,
  isCoreEntry,
  resolveEntries,
  type KnowledgeEntry,
} from "../lib/catalog";
import { practiceSiteUrl } from "../lib/site-links";
import { LogicFormula } from "./logic-formula";

const kindLabels: Record<KnowledgeEntry["kind"], string> = {
  concepts: "核心概念",
  systems: "形式系统",
  methods: "分析方法",
  fallacies: "推理谬误",
  history: "逻辑学史",
};

function EntryLinks({ title, entries }: { title: string; entries: KnowledgeEntry[] }) {
  if (!entries.length) return null;
  return (
    <section className="article-links">
      <h2>{title}</h2>
      <ul>
        {entries.map((entry) => (
          <li key={entry.slug}>
            <Link href={entryPath(entry)}>
              <strong>{entry.title}</strong>
              <span>{entry.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function EntryView({ entry }: { entry: KnowledgeEntry }) {
  const branch = getBranch(entry.branchId);
  if (!branch) throw new Error(`Missing branch for ${entry.slug}`);
  const prerequisites = resolveEntries(entry.prerequisiteSlugs);
  const related = resolveEntries(entry.relatedSlugs);
  const coreEntry = isCoreEntry(entry.slug);

  return (
    <main id="main-content" className="article-shell">
      <nav className="breadcrumbs" aria-label="面包屑">
        <Link href="/">首页</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/branches/${branch.id}`}>{branch.title}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{entry.title}</span>
      </nav>

      <div className="article-layout">
        <article className="knowledge-article">
          <header className="article-header">
            <div className="article-meta-line">
              <span>{kindLabels[entry.kind]}</span>
              <span>{entry.difficulty}</span>
              <span>{coreEntry ? "学习路径核心条目" : "专题延伸条目"}</span>
            </div>
            <h1>{entry.title}</h1>
            <p className="article-lead">{entry.summary}</p>
            {entry.aliases.length ? <p className="aliases">别名：{entry.aliases.join("、")}</p> : null}
          </header>

          {entry.keyTakeaway ? (
            <aside className="key-takeaway" aria-label="一句话结论">
              <span className="eyebrow">一句话结论</span>
              <p>{entry.keyTakeaway}</p>
            </aside>
          ) : null}

          {entry.objectives?.length ? (
            <section className="learning-objectives" aria-labelledby="objectives-title">
              <p className="eyebrow">学习目标</p>
              <h2 id="objectives-title">读完本条目，你应当能够</h2>
              <ul>
                {entry.objectives.map((objective) => <li key={objective}>{objective}</li>)}
              </ul>
            </section>
          ) : null}

          {entry.formulas?.map((formula) => (
            <LogicFormula key={`${entry.slug}-${formula.label}`} {...formula} />
          ))}

          {entry.sections.map((section) => (
            <section className="article-section" key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}

          {entry.workedExamples?.length ? (
            <section className="worked-examples" aria-labelledby="examples-title">
              <p className="eyebrow">逐步例题</p>
              <h2 id="examples-title">把概念用于一个具体问题</h2>
              {entry.workedExamples.map((example) => (
                <article className="worked-example" key={example.title}>
                  <h3>{example.title}</h3>
                  <p>{example.setup}</p>
                  {example.formulas?.map((formula) => (
                    <LogicFormula key={`${entry.slug}-${example.title}-${formula.label}`} {...formula} />
                  ))}
                  <ol className="example-steps">
                    {example.steps.map((step) => <li key={step}>{step}</li>)}
                  </ol>
                  <p className="example-result"><strong>结论：</strong>{example.result}</p>
                </article>
              ))}
            </section>
          ) : null}

          {entry.misconceptions?.length ? (
            <section className="misconceptions" aria-labelledby="misconceptions-title">
              <p className="eyebrow">常见误区</p>
              <h2 id="misconceptions-title">需要纠正的直觉</h2>
              {entry.misconceptions.map((item) => (
                <div key={item.claim}>
                  <p><strong>误区：</strong>{item.claim}</p>
                  <p><strong>纠正：</strong>{item.correction}</p>
                </div>
              ))}
            </section>
          ) : null}

          {entry.selfCheck?.length ? (
            <section className="self-check" aria-labelledby="selfcheck-title">
              <p className="eyebrow">快速自测</p>
              <h2 id="selfcheck-title">先想一想，再展开答案</h2>
              {entry.selfCheck.map((item) => (
                <details className="self-check-item" key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </section>
          ) : null}

          <section className="practice-prompt" aria-labelledby="practice-title">
            <p className="eyebrow">动手检验</p>
            <h2 id="practice-title">一个思考练习</h2>
            <p>{entry.practice.prompt}</p>
            {entry.practice.hint && entry.practice.solution ? (
              <details className="practice-solution">
                <summary>查看提示与参考解析</summary>
                <div>
                  <p><strong>提示：</strong>{entry.practice.hint}</p>
                  <p><strong>参考解析：</strong>{entry.practice.solution}</p>
                </div>
              </details>
            ) : null}
            <a className="practice-site-link" href={practiceSiteUrl(branch.id)}>去练习站检验本分支</a>
          </section>

          <EntryLinks title="前置知识" entries={prerequisites} />
          <EntryLinks title="关联条目" entries={related} />
        </article>

        <aside className="article-aside" aria-label="条目信息">
          <div>
            <span>所属分支</span>
            <Link href={`/branches/${branch.id}`}>{branch.title}</Link>
          </div>
          <div>
            <span>学习难度</span>
            <strong>{entry.difficulty}</strong>
          </div>
          <div>
            <span>关键词</span>
            <p>{entry.tags.join(" · ")}</p>
          </div>
          <p className="aside-note">
            {coreEntry
              ? "本条目属于学习路径核心内容，包含目标、讲解、例题、误区与练习解析。"
              : "本条目属于专题延伸，同样包含讲解、例题、误区、自测与练习解析。"}
          </p>
        </aside>
      </div>
    </main>
  );
}
