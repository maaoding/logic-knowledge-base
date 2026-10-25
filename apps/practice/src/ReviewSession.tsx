import { useEffect, useRef, useState } from "react";
import { AnswerFeedback, QuestionOptions } from "./QuestionParts";
import { collectWrongAnswers, overrideWrongAnswer, type WrongAnswerItem } from "./progress";
import { isExactMatch } from "./scoring";
import { useAnswerFlow } from "./useAnswerFlow";

export function ReviewSession() {
  const [queue, setQueue] = useState<WrongAnswerItem[]>(() => collectWrongAnswers());
  const [questionIndex, setQuestionIndex] = useState(0);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [eliminatedCount, setEliminatedCount] = useState(0);

  const finished = questionIndex >= queue.length;
  const currentItem = finished ? undefined : queue[questionIndex];

  // 答对立即覆盖原记录：即使未点“下一题”就退出，消除结果也不丢失；答错保留错题
  const flow = useAnswerFlow((selectedIds) => {
    if (!currentItem) return;
    const correct = isExactMatch(selectedIds, currentItem.question.correctOptionIds);
    // 仅在原记录确实被覆盖时计数，避免“已消除”数字与存储脱节
    if (correct && overrideWrongAnswer(currentItem, selectedIds)) {
      setEliminatedCount((count) => count + 1);
    }
    setLastCorrect(correct);
  });

  const panelRef = useRef<HTMLElement | null>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement | null>(null);
  // 首次渲染不抢焦点；此后切题/开新一轮/进复习结果时把焦点带回题干或结果标题
  const skipInitialFocusRef = useRef(true);

  useEffect(() => {
    if (skipInitialFocusRef.current) {
      skipInitialFocusRef.current = false;
      return;
    }
    if (finished) resultHeadingRef.current?.focus();
    else panelRef.current?.focus();
  }, [questionIndex, finished]);

  function advance() {
    if (!currentItem) return;
    flow.resetSelection();
    setLastCorrect(false);
    setQuestionIndex((index) => index + 1);
  }

  // 再复习一遍：重新汇集仍答错的题目，开新一轮
  function restartRound() {
    setQueue(collectWrongAnswers());
    setQuestionIndex(0);
    flow.resetSelection();
    setLastCorrect(false);
    setEliminatedCount(0);
  }

  const breadcrumbs = (
    <nav className="breadcrumbs" aria-label="面包屑"><a href="./">全部分支</a><span>/</span><span>错题复习</span></nav>
  );

  if (queue.length === 0) {
    return (
      <main id="main-content" className="practice-shell session-main">
        {breadcrumbs}
        <header className="review-empty">
          <p className="eyebrow">错题复习</p>
          <h1>当前没有待复习的错题</h1>
          <p>各分支最近一次作答都已正确（或者还没有开始作答）。继续练习，答错的题目会自动汇集到这里。</p>
          <div className="result-actions"><a className="primary-button" href="./">返回全部分支</a></div>
        </header>
      </main>
    );
  }

  if (!currentItem) {
    const pendingCount = queue.length - eliminatedCount;
    return (
      <main id="main-content" className="practice-shell session-main result-main">
        {breadcrumbs}
        <header className="result-header">
          <p className="eyebrow">本轮复习完成</p>
          <h1 tabIndex={-1} ref={resultHeadingRef}>错题复习</h1>
          <div className="review-summary">
            <p className="result-score"><strong>{eliminatedCount}</strong><span>道已消除</span></p>
            <p className="result-score"><strong>{pendingCount}</strong><span>道仍待复习</span></p>
          </div>
          <p>{pendingCount === 0 ? "这些题目最近一次作答都已答对，原记录已更新为正确。" : "仍待复习的题目保留原记录，可以再来一轮。"}</p>
        </header>
        <div className="result-actions">
          {pendingCount > 0 ? <button className="primary-button" type="button" onClick={restartRound}>再复习一遍</button> : null}
          <a className="secondary-button" href="./">返回全部分支</a>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="practice-shell session-main">
      {breadcrumbs}

      <header className="session-heading">
        <div><p className="eyebrow">跨分支薄弱点</p><h1>错题复习</h1></div>
        <div className="progress-copy" aria-label={`第 ${questionIndex + 1} 题，共 ${queue.length} 题`}>
          <strong>{String(questionIndex + 1).padStart(2, "0")}</strong><span>/ {String(queue.length).padStart(2, "0")}</span>
        </div>
      </header>
      <div className="progress-track" aria-hidden="true"><span style={{ width: `${((questionIndex + 1) / queue.length) * 100}%` }} /></div>

      <section className="question-panel" aria-labelledby="review-question-title" ref={panelRef} tabIndex={-1}>
        <div className="question-meta">
          <span>{currentItem.question.kind === "single" ? "单选题" : "多选题"}</span>
          <span>来自分支：{currentItem.branch.title}</span>
        </div>
        <fieldset>
          <legend id="review-question-title">{currentItem.question.prompt}</legend>
          <QuestionOptions
            question={currentItem.question}
            selectedIds={flow.selectedIds}
            submitted={flow.submitted}
            onChange={(optionId, checked) => flow.changeSelection(currentItem.question.kind, optionId, checked)}
          />
        </fieldset>

        {flow.submitted ? <AnswerFeedback question={currentItem.question} correct={lastCorrect} /> : null}

        <div className="question-actions">
          {!flow.submitted ? (
            <button className="primary-button" type="button" disabled={flow.selectedIds.length === 0} onClick={flow.submit}>提交答案</button>
          ) : (
            <button className="primary-button" type="button" onClick={advance}>{questionIndex === queue.length - 1 ? "查看复习结果" : "下一题"}</button>
          )}
          <a href="./">退出复习</a>
        </div>
      </section>
    </main>
  );
}
