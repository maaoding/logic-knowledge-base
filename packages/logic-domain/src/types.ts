export type BranchId =
  | "foundations"
  | "traditional"
  | "propositional"
  | "predicate"
  | "modal"
  | "inductive"
  | "informal"
  | "mathematical"
  | "philosophical"
  | "history";

export type EntryKind = "concepts" | "systems" | "methods" | "fallacies" | "history";
export type Difficulty = "入门" | "进阶" | "专题";

export interface Branch {
  id: BranchId;
  title: string;
  group: "起点" | "形式逻辑" | "推理与论证" | "进阶逻辑" | "多文明逻辑史";
  symbol: string;
  eyebrow: string;
  summary: string;
  level: Difficulty;
  order: number;
}

export interface EntryManifest {
  slug: string;
  kind: EntryKind;
  branchId: BranchId;
  title: string;
  aliases: string[];
  summary: string;
  tags: string[];
}

export type PracticeQuestionKind = "single" | "multiple";

export interface PracticeOption {
  id: string;
  text: string;
}

export interface PracticeQuestion {
  id: string;
  branchId: BranchId;
  entrySlug: string;
  kind: PracticeQuestionKind;
  prompt: string;
  options: PracticeOption[];
  correctOptionIds: string[];
  explanation: string;
}
