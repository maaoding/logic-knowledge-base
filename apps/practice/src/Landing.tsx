import { branches, getQuestionsByBranch, practiceQuestions } from "@logic/domain";
import { buildProgressOverview, type BranchProgressSummary, type ProgressOverview } from "./progress";

function branchProgressLabel(summary: BranchProgressSummary) {
  if (summary.state === "not-started") return "未开始";
  if (summary.state === "in-progress") return `进行中 · 已答 ${summary.answered}/${summary.questionTotal}`;
  return `已完成 · 得分 ${summary.score}/${summary.questionTotal}`;
}

function ProgressOverviewSection({ overview }: { overview: ProgressOverview }) {
  return (
    <section aria-labelledby="progress-title" className="progress-section">
      <div className="section-heading">
        <div><p className="eyebrow">本地进度</p><h2 id="progress-title">学习进度</h2></div>
        <span>已完成 {overview.completedBranches} / {branches.length} 个分支 · 待复习 {overview.wrongTotal} 道错题</span>
      </div>
      {overview.wrongTotal > 0 ? (
        <a className="review-cta" href="?review=wrong">复习 {overview.wrongTotal} 道错题</a>
      ) : (
        <p className="review-calm">暂无待复习的错题，答错的题目会自动汇集到这里。</p>
      )}
      <ul className="branch-progress-list">
        {overview.branchSummaries.map((summary) => (
          <li key={summary.branch.id}>
            <a href={`?branch=${summary.branch.id}`}>
              <strong>{summary.branch.title}</strong>
              <span className={`branch-progress-state is-${summary.state}`}>{branchProgressLabel(summary)}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Landing({ invalidBranch }: { invalidBranch?: string }) {
  const overview = buildProgressOverview();
  const summaryByBranch = new Map(overview.branchSummaries.map((summary) => [summary.branch.id, summary]));
  return (
    <main id="main-content" className="practice-shell landing-main">
      <header className="landing-intro">
        <p className="eyebrow">按分支自由练习</p>
        <h1>选一个分支，检验你的理解</h1>
        <p>每题提交后立即显示答案、解释和对应知识条目。答题进度保存在此浏览器本地，切换分支或稍后回来都能继续。</p>
      </header>

      {invalidBranch ? (
        <p className="invalid-notice" role="alert">没有名为“{invalidBranch}”的练习分支，已返回全部分支。</p>
      ) : null}

      <ProgressOverviewSection overview={overview} />

      <section aria-labelledby="branch-list-title">
        <div className="section-heading">
          <div><p className="eyebrow">十个入口</p><h2 id="branch-list-title">从正在学习的部分开始</h2></div>
          <span>共 {practiceQuestions.length} 题</span>
        </div>
        <div className="branch-grid">
          {branches.map((branch) => {
            const summary = summaryByBranch.get(branch.id);
            return (
              <a href={`?branch=${branch.id}`} className="branch-card" key={branch.id}>
                <span className="branch-symbol">{branch.symbol}</span>
                <div>
                  <small>{branch.group} · {branch.level}</small>
                  <h3>{branch.title}</h3>
                  <p>{branch.summary}</p>
                </div>
                <div className="branch-card-meta">
                  <strong>{getQuestionsByBranch(branch.id).length} 题</strong>
                  {summary && summary.state !== "not-started" ? (
                    <small className={`branch-card-progress is-${summary.state}`}>{branchProgressLabel(summary)}</small>
                  ) : null}
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </main>
  );
}
