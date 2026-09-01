import { branches, entryManifest, entryPath, getQuestionsByBranch, type Branch, type PracticeQuestion } from "@logic/domain";
import { useState } from "react";
import { isExactMatch, scoreAnswers, type AnswerRecord } from "./scoring";

type Theme = "light" | "dark";

const knowledgeBaseOrigin = import.meta.env.VITE_KNOWLEDGE_BASE_URL ?? "http://localhost:3000/";

function absoluteKnowledgeUrl(path = "/") {
  return new URL(path.replace(/^\//, ""), knowledgeBaseOrigin.endsWith("/") ? knowledgeBaseOrigin : `${knowledgeBaseOrigin}/`).href;
}

function knowledgeUrlForQuestion(question: PracticeQuestion) {
  const entry = entryManifest.find((candidate) => candidate.slug === question.entrySlug);
  return entry ? absoluteKnowledgeUrl(entryPath(entry)) : absoluteKnowledgeUrl();
}

function answerText(question: PracticeQuestion, optionIds: string[]) {
  return optionIds
    .map((optionId) => {
      const option = question.options.find((candidate) => candidate.id === optionId);
      return option ? `${option.id.toUpperCase()}. ${option.text}` : optionId;
    })
    .join("；");
}

function ThemeButton({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <button className="theme-button" type="button" onClick={onToggle} aria-label={`切换为${theme === "light" ? "深色" : "浅色"}主题`}>
      <span aria-hidden="true">{theme === "light" ? "◐" : "◑"}</span>
      {theme === "light" ? "深色" : "浅色"}
    </button>
  );
}

function SiteHeader({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <header className="practice-header">
      <div className="practice-shell header-inner">
        <a className="practice-brand" href="./">
          <strong>逻辑学分支练习</strong>
          <small>每次三题 · 即时解析</small>
        </a>
        <nav aria-label="站点操作">
          <a href={absoluteKnowledgeUrl()}>返回逻辑学知识库</a>
          <ThemeButton theme={theme} onToggle={onToggle} />
        </nav>
      </div>
    </header>
  );
}

function Landing({ invalidBranch }: { invalidBranch?: string }) {
  return (
    <main id="main-content" className="practice-shell landing-main">
      <header className="landing-intro">
        <p className="eyebrow">按分支自由练习</p>
        <h1>选一个分支，用三道题检验理解</h1>
        <p>每题提交后立即显示答案、解释和对应知识条目。切换分支或刷新页面会清空当前结果。</p>
      </header>

      {invalidBranch ? (
        <p className="invalid-notice" role="alert">没有名为“{invalidBranch}”的练习分支，已返回全部分支。</p>
      ) : null}

      <section aria-labelledby="branch-list-title">
        <div className="section-heading">
          <div><p className="eyebrow">十个入口</p><h2 id="branch-list-title">从正在学习的部分开始</h2></div>
          <span>共 30 题</span>
        </div>
        <div className="branch-grid">
          {branches.map((branch) => (
            <a href={`?branch=${branch.id}`} className="branch-card" key={branch.id}>
              <span className="branch-symbol">{branch.symbol}</span>
              <div>
                <small>{branch.group} · {branch.level}</small>
                <h3>{branch.title}</h3>
                <p>{branch.summary}</p>
              </div>
              <strong>3 题</strong>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

function QuestionOptions({ question, selectedIds, submitted, onChange }: {
  question: PracticeQuestion;
  selectedIds: string[];
  submitted: boolean;
  onChange: (optionId: string, checked: boolean) => void;
}) {
  const inputType = question.kind === "single" ? "radio" : "checkbox";
  return (
    <div className="option-list">
      {question.options.map((option) => {
        const selected = selectedIds.includes(option.id);
        const correct = question.correctOptionIds.includes(option.id);
        const stateClass = submitted && correct ? " is-correct" : submitted && selected ? " is-wrong" : "";
        return (
          <label className={`option-row${selected ? " is-selected" : ""}${stateClass}`} key={option.id}>
            <input
              type={inputType}
              name={question.id}
              value={option.id}
              checked={selected}
              disabled={submitted}
              onChange={(event) => onChange(option.id, event.target.checked)}
            />
            <span className="option-marker" aria-hidden="true">{option.id.toUpperCase()}</span>
            <span>{option.text}</span>
          </label>
        );
      })}
    </div>
  );
}

function PracticeSession({ branch }: { branch: Branch }) {
  const questions = getQuestionsByBranch(branch.id);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const currentQuestion = questions[questionIndex];
  const complete = answers.length === questions.length;

  function changeSelection(optionId: string, checked: boolean) {
    if (submitted) return;
    if (currentQuestion.kind === "single") {
      setSelectedIds(checked ? [optionId] : []);
      return;
    }
    setSelectedIds((current) => checked ? [...current, optionId] : current.filter((id) => id !== optionId));
  }

  function moveNext() {
    const record: AnswerRecord = {
      questionId: currentQuestion.id,
      selectedIds: [...selectedIds],
      correct: isExactMatch(selectedIds, currentQuestion.correctOptionIds),
    };
    setAnswers((current) => [...current, record]);
    setSelectedIds([]);
    setSubmitted(false);
    if (questionIndex < questions.length - 1) setQuestionIndex((current) => current + 1);
  }

  function restart() {
    setQuestionIndex(0);
    setSelectedIds([]);
    setSubmitted(false);
    setAnswers([]);
  }

  if (complete) {
    const score = scoreAnswers(answers);
    return (
      <main id="main-content" className="practice-shell session-main result-main">
        <nav className="breadcrumbs" aria-label="面包屑"><a href="./">全部分支</a><span>/</span><span>{branch.title}</span></nav>
        <header className="result-header">
          <p className="eyebrow">本次练习完成</p>
          <h1>{branch.title}</h1>
          <p className="result-score"><strong>{score}</strong><span>/ 3</span></p>
          <p>{score === 3 ? "三个知识点都已掌握，可以继续下一个分支。" : "查看下面的解析与知识链接，再重新练习一次。"}</p>
        </header>

        <ol className="answer-review">
          {questions.map((question, index) => {
            const answer = answers.find((candidate) => candidate.questionId === question.id)!;
            return (
              <li key={question.id} className={answer.correct ? "review-correct" : "review-wrong"}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <small>{answer.correct ? "回答正确" : "需要复习"}</small>
                  <h2>{question.prompt}</h2>
                  <p><strong>你的答案：</strong>{answerText(question, answer.selectedIds)}</p>
                  <p><strong>正确答案：</strong>{answerText(question, question.correctOptionIds)}</p>
                  <p>{question.explanation}</p>
                  <a href={knowledgeUrlForQuestion(question)}>阅读对应知识条目</a>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="result-actions">
          <button className="primary-button" type="button" onClick={restart}>重新练习本分支</button>
          <a className="secondary-button" href="./">选择其他分支</a>
        </div>
      </main>
    );
  }

  const currentCorrect = submitted && isExactMatch(selectedIds, currentQuestion.correctOptionIds);
  return (
    <main id="main-content" className="practice-shell session-main">
      <nav className="breadcrumbs" aria-label="面包屑"><a href="./">全部分支</a><span>/</span><span>{branch.title}</span></nav>

      <header className="session-heading">
        <div><p className="eyebrow">{branch.group}</p><h1>{branch.title}</h1></div>
        <div className="progress-copy" aria-label={`第 ${questionIndex + 1} 题，共 ${questions.length} 题`}>
          <strong>{String(questionIndex + 1).padStart(2, "0")}</strong><span>/ 03</span>
        </div>
      </header>
      <div className="progress-track" aria-hidden="true"><span style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div>

      <section className="question-panel" aria-labelledby="question-title">
        <div className="question-meta">
          <span>{currentQuestion.kind === "single" ? "单选题" : "多选题"}</span>
          <span>{currentQuestion.kind === "multiple" ? "选择所有正确项" : "选择一个答案"}</span>
        </div>
        <fieldset>
          <legend id="question-title">{currentQuestion.prompt}</legend>
          <QuestionOptions question={currentQuestion} selectedIds={selectedIds} submitted={submitted} onChange={changeSelection} />
        </fieldset>

        {submitted ? (
          <div className={`answer-feedback ${currentCorrect ? "is-correct" : "is-wrong"}`} role="status" aria-live="polite" data-answer-state={currentCorrect ? "correct" : "wrong"}>
            <strong>{currentCorrect ? "回答正确" : "还差一步"}</strong>
            <p className="correct-answer"><strong>正确答案：</strong>{answerText(currentQuestion, currentQuestion.correctOptionIds)}</p>
            <p>{currentQuestion.explanation}</p>
            <a href={knowledgeUrlForQuestion(currentQuestion)}>回知识库阅读对应条目</a>
          </div>
        ) : null}

        <div className="question-actions">
          {!submitted ? (
            <button className="primary-button" type="button" disabled={selectedIds.length === 0} onClick={() => setSubmitted(true)}>提交答案</button>
          ) : (
            <button className="primary-button" type="button" onClick={moveNext}>{questionIndex === questions.length - 1 ? "查看本次结果" : "下一题"}</button>
          )}
          <a href="./">退出并选择其他分支</a>
        </div>
      </section>
    </main>
  );
}

export function App() {
  const [theme, setTheme] = useState<Theme>(() => document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  const branchParameter = new URLSearchParams(window.location.search).get("branch");
  const branch = branches.find((candidate) => candidate.id === branchParameter);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("logicPractice.theme", nextTheme);
  }

  return (
    <>
      <a className="skip-link" href="#main-content">跳到正文</a>
      <SiteHeader theme={theme} onToggle={toggleTheme} />
      {branch ? <PracticeSession branch={branch} /> : <Landing invalidBranch={branchParameter ?? undefined} />}
      <footer className="practice-footer">
        <div className="practice-shell"><p>答案与成绩仅保留在当前页面会话中，不会上传或持久保存。</p><a href={absoluteKnowledgeUrl()}>逻辑学知识库</a></div>
      </footer>
    </>
  );
}
