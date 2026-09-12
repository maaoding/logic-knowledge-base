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
  {
    slug: "formal-systems-tour",
    title: "形式系统进阶",
    level: "专题",
    summary: "从模态语义走到公理系统，再进入可计算性与不完全性，最后比较三大非经典后承方案。",
    foundationSlugs: ["truth-validity-soundness", "material-implication", "multiple-quantification", "quantifier-scope", "natural-deduction", "quantifiers"],
    foundationNote: "本条路径假定命题与谓词的核心训练已经完成；建议先走完“从命题到量词”，再进入形式系统。",
    steps: [
      { entrySlug: "necessity-possibility", stage: "起点", goal: "把必然与可能收进形式语言" },
      { entrySlug: "possible-worlds-semantics", stage: "核心", goal: "用可及结构解释模态算子" },
      { entrySlug: "normal-modal-systems", stage: "核心", goal: "从 K 到 S5：公理与框架条件互相换算" },
      { entrySlug: "modal-scope", stage: "核心", goal: "管住模态词与量词的辖域组合" },
      { entrySlug: "proof-and-derivability", stage: "核心", goal: "把证明写成可逐行核对的符号序列" },
      { entrySlug: "soundness-completeness", stage: "核心", goal: "分清语法后承与语义后承，并让两者对接" },
      { entrySlug: "computability", stage: "核心", goal: "划出机器可解问题的边界" },
      { entrySlug: "godel-incompleteness", stage: "整合", goal: "在足够强的算术理论中直面真与可证的分离" },
      { entrySlug: "classical-and-intuitionistic", stage: "延伸", goal: "用构造性标准重审经典推理" },
      { entrySlug: "logical-consequence-pluralism", stage: "延伸", goal: "为不同后承概念建立公平的比较框架" },
      { entrySlug: "relevant-and-paraconsistent", stage: "整合", goal: "检查前提相关性与爆炸原理的去留" },
    ],
  },
  {
    slug: "logic-across-civilizations",
    title: "逻辑的文明史",
    level: "入门",
    summary: "并列走进中国、印度与希腊的推理传统，沿欧洲主线穿过中世纪精化与现代转折。",
    foundationSlugs: ["argument-structure", "truth-validity-soundness", "multiple-quantification", "soundness-completeness"],
    foundationNote: "出发前建议先读“论证结构”与“真值、有效性与健全性”；后半程的弗雷格与元逻辑两步需要量词与元逻辑的基本图像。",
    steps: [
      { entrySlug: "mohist-logic", stage: "起点", goal: "看《墨经》如何讨论名、实、故、类" },
      { entrySlug: "nyaya", stage: "起点", goal: "用五支论式重构一个论辩案例" },
      { entrySlug: "aristotle", stage: "核心", goal: "进入第一个系统化的演绎体系" },
      { entrySlug: "categorical-propositions", stage: "核心", goal: "把词项关系写成标准直言命题" },
      { entrySlug: "categorical-syllogism", stage: "核心", goal: "用中项连接结论的两端" },
      { entrySlug: "venn-diagram-testing", stage: "延伸", goal: "用图形机械检验三段论" },
      { entrySlug: "medieval-logic", stage: "延伸", goal: "看词项指代与推论学说的精化" },
      { entrySlug: "frege", stage: "核心", goal: "用函数—论元与量词改写推理" },
      { entrySlug: "hilbert-godel-metalogic", stage: "整合", goal: "把形式系统本身变成研究对象" },
    ],
  },
];

export function getLearningPath(slug: string) {
  return learningPaths.find((path) => path.slug === slug);
}
