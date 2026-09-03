import type { Difficulty } from "./types";

export type PathStage = "起点" | "核心" | "延伸" | "整合";

export interface PathStep {
  entrySlug: string;
  stage: PathStage;
  goal: string;
}

export interface LearningPath {
  slug: string;
  title: string;
  level: Difficulty;
  summary: string;
  foundationSlugs: string[];
  foundationNote?: string;
  steps: PathStep[];
}

export const learningPaths: LearningPath[] = [
  {
    slug: "argument-to-validity",
    title: "从论证到有效性",
    level: "入门",
    summary: "从自然语言中的理由结构，逐步走到三段论、真值表和形式证明。",
    foundationSlugs: [],
    steps: [
      { entrySlug: "argument-structure", stage: "起点", goal: "辨认前提、结论与隐含前提" },
      { entrySlug: "deduction-and-induction", stage: "核心", goal: "区分必然保证与程度支持" },
      { entrySlug: "truth-validity-soundness", stage: "核心", goal: "分开评价真值、形式与前提" },
      { entrySlug: "categorical-propositions", stage: "延伸", goal: "把词项关系化为标准直言命题" },
      { entrySlug: "categorical-syllogism", stage: "延伸", goal: "观察中项怎样连接结论两项" },
      { entrySlug: "propositional-language", stage: "核心", goal: "掌握联结词与公式结构" },
      { entrySlug: "truth-tables", stage: "整合", goal: "用语义方法机械检验有效性" },
      { entrySlug: "natural-deduction", stage: "整合", goal: "把有效推理写成逐步证明" },
    ],
  },
  {
    slug: "proposition-to-quantifier",
    title: "从命题到量词",
    level: "进阶",
    summary: "从真值联结词进入对象、性质、关系、量词辖域与模态表达。",
    foundationSlugs: ["truth-validity-soundness"],
    foundationNote: "建议先完成第一条路径的前三步；至少读完“真值、有效性与健全性”，再进入命题形式语言。",
    steps: [
      { entrySlug: "propositional-language", stage: "起点", goal: "建立命题逻辑形式语言" },
      { entrySlug: "truth-tables", stage: "核心", goal: "掌握复合命题的真值条件" },
      { entrySlug: "material-implication", stage: "核心", goal: "理解经典条件句及其边界" },
      { entrySlug: "natural-deduction", stage: "核心", goal: "用规则构造命题证明" },
      { entrySlug: "predicate-language", stage: "延伸", goal: "进入对象、性质和关系结构" },
      { entrySlug: "quantifiers", stage: "核心", goal: "表达全称与存在" },
      { entrySlug: "quantifier-scope", stage: "核心", goal: "管理辖域和自由变元" },
      { entrySlug: "multiple-quantification", stage: "整合", goal: "用量词顺序表达依赖" },
      { entrySlug: "necessity-possibility", stage: "整合", goal: "把必然与可能加入形式语言" },
    ],
  },
  {
    slug: "induction-and-real-arguments",
    title: "归纳与现实论证",
    level: "入门",
    summary: "评价不确定证据，并把结构分析用于调查、解释和公共讨论。",
    foundationSlugs: ["argument-structure", "material-implication"],
    foundationNote: "先用“论证结构”补齐起点；“实质蕴涵”是最后分析肯定后件前需要的条件句基础。",
    steps: [
      { entrySlug: "deduction-and-induction", stage: "起点", goal: "明确现实论证承诺的支持程度" },
      { entrySlug: "inductive-strength", stage: "核心", goal: "按程度评价证据支持" },
      { entrySlug: "enumerative-induction", stage: "核心", goal: "检查样本与总体的距离" },
      { entrySlug: "analogical-argument", stage: "延伸", goal: "区分相关相似与表面相似" },
      { entrySlug: "inference-to-best-explanation", stage: "延伸", goal: "比较候选解释和区分性证据" },
      { entrySlug: "argument-mapping", stage: "核心", goal: "画出理由、反驳与中间结论" },
      { entrySlug: "ambiguity-and-definition", stage: "核心", goal: "固定关键词含义和讨论边界" },
      { entrySlug: "burden-of-proof", stage: "整合", goal: "公平分配举证与重构责任" },
      { entrySlug: "affirming-the-consequent", stage: "整合", goal: "用替代解释识别条件推理错误" },
    ],
  },
  {
    slug: "real-arguments-and-fallacies",
    title: "现实论证与常见误区",
    level: "入门",
    summary: "从忠实重构开始，辨认现实讨论中常见的立场歪曲、无关攻击、选项压缩与因果误判。",
    foundationSlugs: [],
    steps: [
      { entrySlug: "argument-structure", stage: "起点", goal: "先还原对方实际提出的前提与结论" },
      { entrySlug: "deduction-and-induction", stage: "核心", goal: "分清必然推出与程度支持" },
      { entrySlug: "argument-mapping", stage: "核心", goal: "标出理由、反驳、隐含前提与中间结论" },
      { entrySlug: "burden-of-proof", stage: "核心", goal: "分配举证责任并保持重构忠实" },
      { entrySlug: "ambiguity-and-definition", stage: "延伸", goal: "固定关键词含义与选择边界" },
      { entrySlug: "straw-man", stage: "延伸", goal: "比较原主张与被攻击版本是否一致" },
      { entrySlug: "ad-hominem", stage: "延伸", goal: "区分论证评价与相关的来源核查" },
      { entrySlug: "false-dilemma", stage: "延伸", goal: "检查列出的选项是否真正穷尽可能" },
      { entrySlug: "inductive-strength", stage: "整合", goal: "按证据强度评价现实结论" },
      { entrySlug: "causal-misreasoning", stage: "整合", goal: "用替代解释与对照检查因果主张" },
    ],
  },
];

export function getLearningPath(slug: string) {
  return learningPaths.find((path) => path.slug === slug);
}
