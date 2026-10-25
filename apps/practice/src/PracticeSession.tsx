import { getQuestionsByBranch, type Branch } from "@logic/domain";
import { useEffect, useRef, useState } from "react";
import { answerText, AnswerFeedback, QuestionOptions } from "./QuestionParts";
import { knowledgeUrlForQuestion } from "./knowledge-links";
import { buildProgressOverview, loadBranchProgress, saveBranchProgress } from "./progress";
import { isExactMatch, scoreAnswers, type AnswerRecord } from "./scoring";
import { useAnswerFlow } from "./useAnswerFlow";

export function PracticeSession({ branch }: { branch: Branch }) {
  const questions = getQuestionsByBranch(branch.id);
  const initialAnswers = loadBranchProgress(branch.id, questions);
  // 已答记录按 questionId 对齐，恢复时定位第一道未答题，不假设作答必然是连续前缀
  const firstUnansweredIndex = questions.findIndex(
    (question) => !initialAnswers.some((answer) => answer.questionId === question.id),
  );
  const allAnswered = firstUnansweredIndex === -1;
  const [questionIndex, setQuestionIndex] = useState(allAnswered ? 0 : firstUnansweredIndex);
  const [answers, setAnswers] = useState<AnswerRecord[]>(initialAnswers);
  // 最后一题提交后先留在解析页，点“查看本次结果”才进入结果页；打开已完成分支时直接看结果
  const [viewingResult, setViewingResult] = useState(allAnswered);
  // 结果页的“重新练习”会清空整分支记录，先进入确认态防误触
  const [confirmingRestart, setConfirmingRestart] = useState(false);
  const currentQuestion = questions[questionIndex];
  const complete = viewingResult;

  // 提交即保存：即使未点“下一题”就退出，本题结果也不丢失
  const flow = useAnswerFlow((selectedIds) => {
    const record: AnswerRecord = {
      questionId: currentQuestion.id,
      selectedIds: [...selectedIds],
      correct: isExactMatch(selectedIds, currentQuestion.correctOptionIds),
    };
    // 同题重复提交时按 id 覆盖，避免恢复旧进度后结果页记录重复
    const nextAnswers = [...answers.filter((item) => item.questionId !== record.questionId), record];
    saveBranchProgress(branch.id, nextAnswers);
    setAnswers(nextAnswers);
  });

  const panelRef = useRef<HTMLElement | null>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const restartButtonRef = useRef<HTMLButtonElement | null>(null);
  const confirmButtonRef = useRef<HTMLButtonElement | null>(null);
  const hadConfirmationRef = useRef(false);
  // 首次渲染不抢焦点；此后切题/重练/进结果页时把焦点带回题干或结果标题，键盘用户不必从页首重新 Tab
  const skipInitialFocusRef = useRef(true);

  useEffect(() => {
    if (skipInitialFocusRef.current) {
      skipInitialFocusRef.current = false;
      return;
    }
    if (complete) resultHeadingRef.current?.focus();
    else panelRef.current?.focus();
  }, [questionIndex, complete]);

  // 进入/退出确认态时保持焦点在操作按钮上
  useEffect(() => {
    if (confirmingRestart) {
      hadConfirmationRef.current = true;
      confirmButtonRef.current?.focus();
      return;
    }
    if (hadConfirmationRef.current) {
      hadConfirmationRef.current = false;
      restartButtonRef.current?.focus();
    }
  }, [confirmingRestart]);

  function moveNext() {
    if (questionIndex === questions.length - 1) {
      setViewingResult(true);
      return;
    }
    flow.resetSelection();
    setQuestionIndex((current) => current + 1);
  }

  function restart() {
    saveBranchProgress(branch.id, []);
    setQuestionIndex(0);
    flow.resetSelection();
    setViewingResult(false);
    setAnswers([]);
    setConfirmingRestart(false);
  }

  if (complete) {
    const score = scoreAnswers(answers);
    // 与 landing 的进度概览同源：跨分支错题总数，点击进入错题复习
    const wrongTotal = buildProgressOverview().wrongTotal;
    return (
      <main id="main-content" className="practice-shell session-main result-main">
        <nav className="breadcrumbs" aria-label="面包屑"><a href="./">全部分支</a><span>/</span><span>{branch.title}</span></nav>
        <header className="result-header">
          <p className="eyebrow">本次练习完成</p>
          <h1 tabIndex={-1} ref={resultHeadingRef}>{branch.title}</h1>
          <p className="result-score"><strong>{score}</strong><span>/ {questions.length}</span></p>
          <p>{score === questions.length ? "本组知识点都已掌握，可以继续下一个分支。" : "查看下面的解析与知识链接，再重新练习一次。"}</p>
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
          {wrongTotal > 0 ? <a className="secondary-button" href="?review=wrong">复习 {wrongTotal} 道错题</a> : null}
          {confirmingRestart ? (
            <>
              <button className="primary-button" type="button" ref={confirmButtonRef} onClick={restart}>确认清空并重新练习</button>
              <button className="secondary-button" type="button" onClick={() => setConfirmingRestart(false)}>取消</button>
            </>
          ) : (
            <button className="primary-button" type="button" ref={restartButtonRef} onClick={() => setConfirmingRestart(true)}>重新练习本分支</button>
          )}
          <a className="secondary-button" href="./">选择其他分支</a>
        </div>
      </main>
    );
  }

  const currentCorrect = flow.submitted && isExactMatch(flow.selectedIds, currentQuestion.correctOptionIds);
  return (
    <main id="main-content" className="practice-shell session-main">
      <nav className="breadcrumbs" aria-label="面包屑"><a href="./">全部分支</a><span>/</span><span>{branch.title}</span></nav>

      <header className="session-heading">
        <div><p className="eyebrow">{branch.group}</p><h1>{branch.title}</h1></div>
        <div className="progress-copy" aria-label={`第 ${questionIndex + 1} 题，共 ${questions.length} 题`}>
          <strong>{String(questionIndex + 1).padStart(2, "0")}</strong><span>/ {String(questions.length).padStart(2, "0")}</span>
        </div>
      </header>
      <div className="progress-track" aria-hidden="true"><span style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div>

      <section className="question-panel" aria-labelledby="question-title" ref={panelRef} tabIndex={-1}>
        <div className="question-meta">
          <span>{currentQuestion.kind === "single" ? "单选题" : "多选题"}</span>
          <span>{currentQuestion.kind === "multiple" ? "选择所有正确项" : "选择一个答案"}</span>
        </div>
        <fieldset>
          <legend id="question-title">{currentQuestion.prompt}</legend>
          <QuestionOptions
            question={currentQuestion}
            selectedIds={flow.selectedIds}
            submitted={flow.submitted}
            onChange={(optionId, checked) => flow.changeSelection(currentQuestion.kind, optionId, checked)}
          />
        </fieldset>

        {flow.submitted ? <AnswerFeedback question={currentQuestion} correct={currentCorrect} /> : null}

        <div className="question-actions">
          {!flow.submitted ? (
            <button className="primary-button" type="button" disabled={flow.selectedIds.length === 0} onClick={flow.submit}>提交答案</button>
          ) : (
            <button className="primary-button" type="button" onClick={moveNext}>{questionIndex === questions.length - 1 ? "查看本次结果" : "下一题"}</button>
          )}
          <a href="./">退出并选择其他分支</a>
        </div>
      </section>
    </main>
  );
}
