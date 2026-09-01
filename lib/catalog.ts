import {
  branches,
  entryManifest,
  entryPath as domainEntryPath,
  getBranchManifest,
  type Branch,
  type BranchId,
  type Difficulty,
  type EntryKind,
  type EntryManifest,
} from "@logic/domain";
import katex from "katex";
import { argumentCases } from "./content/cases";
import { conceptComparisons } from "./content/comparisons";
import { glossaryTermId, glossaryTerms } from "./content/glossary";
import { resourceGroupId, resourceGroups } from "./content/resources";
import {
  foundationsContent,
  historyContent,
  inductiveContent,
  informalContent,
  mathematicalContent,
  modalContent,
  philosophicalContent,
  predicateContent,
  propositionalContent,
  traditionalContent,
  type EntryContent,
  type Formula,
  type WorkedExample,
} from "./content";

export type { Branch, BranchId, Difficulty, EntryKind, Formula, WorkedExample };
export { branches };

export interface KnowledgeEntry extends EntryManifest, Omit<EntryContent, "slug"> {}

export interface PathStep {
  entrySlug: string;
  stage: "起点" | "核心" | "延伸" | "整合";
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

export interface ReferenceSection {
  href: string;
  title: string;
  countLabel: string;
  summary: string;
  useWhen: string;
}

export type SearchKind = EntryKind | "glossary" | "comparison" | "case" | "resource";

export interface SearchRecord {
  slug: string;
  path: string;
  title: string;
  aliases: string[];
  summary: string;
  tags: string[];
  branch: string;
  kind: SearchKind;
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
];

const resourceItemCount = resourceGroups.reduce((total, group) => total + group.items.length, 0);

export const referenceSections: ReferenceSection[] = [
  {
    href: "/glossary",
    title: "术语表",
    countLabel: `${glossaryTerms.length} 个术语`,
    summary: "用够用的定义、易混提示和正文链接快速解开术语卡点。",
    useWhen: "遇到陌生术语，先查定义与易混提示。",
  },
  {
    href: "/comparisons",
    title: "易混概念对照",
    countLabel: `${conceptComparisons.length} 组对照`,
    summary: "把共同点、关键差异和真实易混场景放在同一张对照中。",
    useWhen: "两个概念看起来相近，用对照确认分界。",
  },
  {
    href: "/cases",
    title: "论证分析案例",
    countLabel: `${argumentCases.length} 个案例`,
    summary: "用重构、形式检验与证据评估轮流拆解真实感论证。",
    useWhen: "会背定义却不会应用，从完整案例开始拆。",
  },
  {
    href: "/resources",
    title: "学习资源",
    countLabel: `${resourceItemCount} 项资源`,
    summary: "按百科、教材、交互工具和课程分组，逐项说明用途与注意事项。",
    useWhen: "想继续深入或换一种讲解方式时再打开。",
  },
];

const contentRecords: EntryContent[] = [
  ...foundationsContent,
  ...traditionalContent,
  ...propositionalContent,
  ...predicateContent,
  ...modalContent,
  ...inductiveContent,
  ...informalContent,
  ...mathematicalContent,
  ...philosophicalContent,
  ...historyContent,
];

const contentBySlug = new Map(contentRecords.map((content) => [content.slug, content]));
const branchById = new Map(branches.map((branch) => [branch.id, branch]));

export const knowledgeEntries: KnowledgeEntry[] = entryManifest.map((manifest) => {
  const content = contentBySlug.get(manifest.slug);
  if (!content) throw new Error(`Missing content for ${manifest.slug}`);
  const { slug: _contentSlug, ...details } = content;
  void _contentSlug;
  return { ...manifest, ...details };
});

const entryBySlug = new Map(knowledgeEntries.map((entry) => [entry.slug, entry]));
const coreEntrySlugs = new Set(learningPaths.flatMap((path) => path.steps.map((step) => step.entrySlug)));

export function entryPath(entry: Pick<KnowledgeEntry, "kind" | "slug">) {
  return domainEntryPath(entry);
}

export function getBranch(id: string) {
  return getBranchManifest(id);
}

export function getEntry(slug: string, kind?: EntryKind) {
  const entry = entryBySlug.get(slug);
  return entry && (!kind || entry.kind === kind) ? entry : undefined;
}

export function getEntriesByBranch(branchId: BranchId) {
  return knowledgeEntries.filter((entry) => entry.branchId === branchId);
}

export function getEntriesByKind(kind: EntryKind) {
  return knowledgeEntries.filter((entry) => entry.kind === kind);
}

export function getLearningPath(slug: string) {
  return learningPaths.find((path) => path.slug === slug);
}

export function resolveEntries(slugs: string[]) {
  return slugs.map((slug) => entryBySlug.get(slug)).filter((entry): entry is KnowledgeEntry => Boolean(entry));
}

export function isCoreEntry(slug: string) {
  return coreEntrySlugs.has(slug);
}

const entrySearchIndex: SearchRecord[] = knowledgeEntries.map((entry) => ({
  slug: entry.slug,
  path: entryPath(entry),
  title: entry.title,
  aliases: entry.aliases,
  summary: entry.summary,
  tags: entry.tags,
  branch: branchById.get(entry.branchId)?.title ?? entry.branchId,
  kind: entry.kind,
}));

const glossarySearchIndex: SearchRecord[] = glossaryTerms.map((term) => ({
  slug: `glossary:${term.term}`,
  path: `/glossary#${glossaryTermId(term)}`,
  title: term.term,
  aliases: term.aliases ?? [],
  summary: term.definition,
  tags: [term.confusion ?? "", ...term.seeAlso],
  branch: "术语表",
  kind: "glossary",
}));

const comparisonSearchIndex: SearchRecord[] = conceptComparisons.map((comparison) => ({
  slug: `comparison:${comparison.slug}`,
  path: `/comparisons#${comparison.slug}`,
  title: `${comparison.left.label}与${comparison.right.label}`,
  aliases: [comparison.left.label, comparison.right.label],
  summary: comparison.difference,
  tags: [comparison.shared, comparison.watch],
  branch: "易混概念对照",
  kind: "comparison",
}));

const caseSearchIndex: SearchRecord[] = argumentCases.map((argumentCase) => ({
  slug: `case:${argumentCase.slug}`,
  path: `/cases#${argumentCase.slug}`,
  title: argumentCase.title,
  aliases: [],
  summary: argumentCase.text,
  tags: [
    argumentCase.source,
    ...argumentCase.lenses.flatMap((lens) => [lens.heading, ...lens.body]),
    ...argumentCase.questions,
  ],
  branch: "论证分析案例",
  kind: "case",
}));

const resourceSearchIndex: SearchRecord[] = resourceGroups.flatMap((group) =>
  group.items.map((item, index) => ({
    slug: `resource:${group.slug}:${index}`,
    path: `/resources#${resourceGroupId(group)}`,
    title: item.title,
    aliases: [],
    summary: item.note,
    tags: [group.heading, group.intro, item.caution ?? "", item.url],
    branch: `学习资源 · ${group.heading}`,
    kind: "resource" as const,
  })),
);

export const searchIndex: SearchRecord[] = [
  ...entrySearchIndex,
  ...glossarySearchIndex,
  ...comparisonSearchIndex,
  ...caseSearchIndex,
  ...resourceSearchIndex,
];

function validateFormula(formula: Formula, owner: string) {
  try {
    katex.renderToString(formula.tex, {
      displayMode: formula.display ?? false,
      output: "htmlAndMathml",
      strict: "warn",
      throwOnError: true,
      trust: false,
    });
  } catch (error) {
    throw new Error(`Invalid formula in ${owner}: ${formula.tex}`, { cause: error });
  }
}

function assertCatalogIntegrity() {
  if (contentRecords.length !== entryManifest.length) throw new Error(`Expected ${entryManifest.length} content records, found ${contentRecords.length}.`);
  if (contentBySlug.size !== contentRecords.length) throw new Error("Content slugs must be unique.");
  if (knowledgeEntries.length !== 36) throw new Error(`Expected 36 knowledge entries, found ${knowledgeEntries.length}.`);
  if (learningPaths.length !== 3) throw new Error(`Expected 3 learning paths, found ${learningPaths.length}.`);
  if (new Set(searchIndex.map((record) => record.slug)).size !== searchIndex.length) throw new Error("Search record slugs must be unique.");

  for (const content of contentRecords) {
    if (!entryManifest.some((entry) => entry.slug === content.slug)) throw new Error(`Content has no manifest entry: ${content.slug}`);
  }

  for (const entry of knowledgeEntries) {
    for (const slug of [...entry.prerequisiteSlugs, ...entry.relatedSlugs]) {
      if (slug === entry.slug) throw new Error(`Entry cannot reference itself: ${entry.slug}`);
      if (!entryBySlug.has(slug)) throw new Error(`Unknown relation ${slug} from ${entry.slug}`);
    }
    for (const formula of entry.formulas ?? []) validateFormula(formula, entry.slug);
    for (const example of entry.workedExamples ?? []) {
      for (const formula of example.formulas ?? []) validateFormula(formula, `${entry.slug}/${example.title}`);
    }
  }

  const expectedPathLengths = [8, 9, 9];
  const pathSlugs = new Set<string>();
  for (const [pathIndex, path] of learningPaths.entries()) {
    if (pathSlugs.has(path.slug)) throw new Error(`Duplicate learning path slug: ${path.slug}`);
    pathSlugs.add(path.slug);
    if (path.steps.length !== expectedPathLengths[pathIndex]) throw new Error(`Unexpected step count for ${path.slug}: ${path.steps.length}`);
    const availableSlugs = new Set<string>();
    for (const foundationSlug of path.foundationSlugs) {
      if (!entryBySlug.has(foundationSlug)) throw new Error(`Unknown path foundation ${foundationSlug} in ${path.slug}`);
      if (availableSlugs.has(foundationSlug)) throw new Error(`Duplicate path foundation ${foundationSlug} in ${path.slug}`);
      availableSlugs.add(foundationSlug);
    }
    const stepSlugs = new Set<string>();
    for (const step of path.steps) {
      const entry = entryBySlug.get(step.entrySlug);
      if (!entry) throw new Error(`Unknown path step ${step.entrySlug} in ${path.slug}`);
      if (stepSlugs.has(step.entrySlug)) throw new Error(`Duplicate path step ${step.entrySlug} in ${path.slug}`);
      for (const prerequisiteSlug of entry.prerequisiteSlugs) {
        if (!availableSlugs.has(prerequisiteSlug)) {
          throw new Error(`Path ${path.slug} reaches ${step.entrySlug} before prerequisite ${prerequisiteSlug}`);
        }
      }
      stepSlugs.add(step.entrySlug);
      availableSlugs.add(step.entrySlug);
    }
  }

  for (const slug of coreEntrySlugs) {
    const entry = entryBySlug.get(slug)!;
    if ((entry.objectives?.length ?? 0) < 2) throw new Error(`Core entry ${slug} needs at least two objectives.`);
    if (!(entry.workedExamples?.length)) throw new Error(`Core entry ${slug} needs a worked example.`);
    if (!(entry.misconceptions?.length)) throw new Error(`Core entry ${slug} needs a misconception correction.`);
    if (!entry.practice.hint || !entry.practice.solution) throw new Error(`Core entry ${slug} needs a hint and solution.`);
  }
}

assertCatalogIntegrity();
