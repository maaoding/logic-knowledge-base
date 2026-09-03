import {
  branches,
  getQuestionsByBranch,
  learningPaths,
  practiceQuestions,
  type Branch,
  type PracticeQuestion,
} from "@logic/domain";
import { scoreAnswers, type AnswerRecord } from "./scoring";

const PROGRESS_KEY = "logicPractice.progress";

export function readStoredAnswers(): Record<string, AnswerRecord[]> {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function loadBranchProgress(branchId: string, questions: PracticeQuestion[]): AnswerRecord[] {
  const stored = readStoredAnswers()[branchId];
  if (!Array.isArray(stored)) return [];
  // 题库更新后旧记录的题目顺序可能失配，失配即整体作废
  const matchesCurrentQuestions = stored.every(
    (record, index) => record && record.questionId === questions[index]?.id,
  );
  return matchesCurrentQuestions && stored.length > 0 ? stored : [];
}

export function saveBranchProgress(branchId: string, answers: AnswerRecord[]) {
  try {
    const all = readStoredAnswers();
    if (answers.length === 0) delete all[branchId];
    else all[branchId] = answers;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
  } catch {
    // 本地存储不可用（如隐私模式）时仅放弃持久化，答题流程不受影响
  }
}

export type BranchProgressState = "not-started" | "in-progress" | "completed";

export interface BranchProgressSummary {
  branch: Branch;
  questionTotal: number;
  answered: number;
  score: number;
  wrongCount: number;
  state: BranchProgressState;
}

export interface ProgressOverview {
  completedBranches: number;
  wrongTotal: number;
  branchSummaries: BranchProgressSummary[];
}

export function buildProgressOverview(): ProgressOverview {
  const branchSummaries = branches.map(
    (branch): BranchProgressSummary => {
      const questions = getQuestionsByBranch(branch.id);
      const answers = loadBranchProgress(branch.id, questions);
      return {
        branch,
        questionTotal: questions.length,
        answered: answers.length,
        score: scoreAnswers(answers),
        wrongCount: answers.filter((answer) => !answer.correct).length,
        state: answers.length === 0 ? "not-started" : answers.length === questions.length ? "completed" : "in-progress",
      };
    },
  );
  return {
    completedBranches: branchSummaries.filter((summary) => summary.state === "completed").length,
    wrongTotal: branchSummaries.reduce((total, summary) => total + summary.wrongCount, 0),
    branchSummaries,
  };
}

export interface WrongAnswerItem {
  branch: Branch;
  question: PracticeQuestion;
}

// 学习路径中条目的首次出现顺序：跨路径去重，按第一次出现的位置编号
const pathEntryOrder = (() => {
  const order = new Map<string, number>();
  let next = 0;
  for (const path of learningPaths) {
    for (const step of path.steps) {
      if (!order.has(step.entrySlug)) order.set(step.entrySlug, next);
      next += 1;
    }
  }
  return order;
})();

const bankOrder = new Map(practiceQuestions.map((question, index) => [question.id, index]));

function bankIndexOf(questionId: string) {
  return bankOrder.get(questionId) ?? 0;
}

// 全站错题队列：先按学习路径条目的首次出现顺序，未纳入路径的按分支与题库顺序补齐
export function collectWrongAnswers(): WrongAnswerItem[] {
  const items: WrongAnswerItem[] = [];
  for (const branch of branches) {
    const questions = getQuestionsByBranch(branch.id);
    const answers = loadBranchProgress(branch.id, questions);
    answers.forEach((record, index) => {
      const question = questions[index];
      if (!record.correct && question && question.id === record.questionId) {
        items.push({ branch, question });
      }
    });
  }
  return items.sort((a, b) => {
    const pathA = pathEntryOrder.get(a.question.entrySlug);
    const pathB = pathEntryOrder.get(b.question.entrySlug);
    if (pathA !== undefined && pathB !== undefined && pathA !== pathB) return pathA - pathB;
    if (pathA !== undefined && pathB === undefined) return -1;
    if (pathA === undefined && pathB !== undefined) return 1;
    return bankIndexOf(a.question.id) - bankIndexOf(b.question.id);
  });
}

// 复习答对后覆盖该题的原始记录为正确答案；返回是否真的写入（记录已不存在时保持不动并返回 false）
export function overrideWrongAnswer(item: WrongAnswerItem, selectedIds: string[]): boolean {
  const questions = getQuestionsByBranch(item.branch.id);
  const answers = loadBranchProgress(item.branch.id, questions);
  const recordIndex = answers.findIndex((record) => record.questionId === item.question.id);
  if (recordIndex === -1) return false;
  const nextAnswers = [...answers];
  nextAnswers[recordIndex] = { questionId: item.question.id, selectedIds: [...selectedIds], correct: true };
  saveBranchProgress(item.branch.id, nextAnswers);
  return true;
}
