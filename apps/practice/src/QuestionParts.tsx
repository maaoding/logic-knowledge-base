import type { PracticeQuestion } from "@logic/domain";
import { knowledgeUrlForQuestion } from "./knowledge-links";

export function answerText(question: PracticeQuestion, optionIds: string[]) {
  return optionIds
    .map((optionId) => {
      const option = question.options.find((candidate) => candidate.id === optionId);
      return option ? `${option.id.toUpperCase()}. ${option.text}` : optionId;
    })
    .join("；");
}

export function QuestionOptions({ question, selectedIds, submitted, onChange }: {
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

export function AnswerFeedback({ question, correct }: { question: PracticeQuestion; correct: boolean }) {
  return (
    <div className={`answer-feedback ${correct ? "is-correct" : "is-wrong"}`} role="status" aria-live="polite" data-answer-state={correct ? "correct" : "wrong"}>
      <strong>{correct ? "回答正确" : "还差一步"}</strong>
      <p className="correct-answer"><strong>正确答案：</strong>{answerText(question, question.correctOptionIds)}</p>
      <p>{question.explanation}</p>
      <a href={knowledgeUrlForQuestion(question)}>回知识库阅读对应条目</a>
    </div>
  );
}
