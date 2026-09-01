import type { Difficulty } from "@logic/domain";

export interface ContentSection {
  heading: string;
  paragraphs: string[];
}

export interface Formula {
  tex: string;
  label: string;
  display?: boolean;
}

export interface WorkedExample {
  title: string;
  setup: string;
  steps: string[];
  result: string;
  formulas?: Formula[];
}

export interface Misconception {
  claim: string;
  correction: string;
}

export interface PracticeExercise {
  prompt: string;
  hint?: string;
  solution?: string;
}

export interface SelfCheckItem {
  question: string;
  answer: string;
}

export interface EntryContent {
  slug: string;
  difficulty: Difficulty;
  prerequisiteSlugs: string[];
  relatedSlugs: string[];
  objectives?: string[];
  sections: ContentSection[];
  formulas?: Formula[];
  workedExamples?: WorkedExample[];
  misconceptions?: Misconception[];
  keyTakeaway?: string;
  selfCheck?: SelfCheckItem[];
  practice: PracticeExercise;
  featuredOrder?: number;
}
