export function normalizeSelection(ids: Iterable<string>) {
  return [...new Set(ids)].sort();
}

export function isExactMatch(selectedIds: Iterable<string>, correctOptionIds: Iterable<string>) {
  const selected = normalizeSelection(selectedIds);
  const correct = normalizeSelection(correctOptionIds);
  return selected.length === correct.length && selected.every((id, index) => id === correct[index]);
}

export interface AnswerRecord {
  questionId: string;
  selectedIds: string[];
  correct: boolean;
}

export function scoreAnswers(answers: AnswerRecord[]) {
  return answers.filter((answer) => answer.correct).length;
}
