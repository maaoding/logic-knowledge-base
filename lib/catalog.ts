import {
  branches,
  entryManifest,
  entryPath as domainEntryPath,
  getBranchManifest,
  getLearningPath,
  getPathBranchIds,
  learningPaths,
  type Branch,
  type BranchId,
  type Difficulty,
  type EntryKind,
  type EntryManifest,
  type LearningPath,
  type PathStep,
} from "@logic/domain";
import katex from "katex";
import { argumentCases } from "./content/cases";
import { conceptComparisons } from "./content/comparisons";
import { glossaryTermId, glossaryTerms } from "./content/glossary";
import { resourceGroups } from "./content/resources";
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

export type { Branch, BranchId, Difficulty, EntryKind, Formula, WorkedExample, LearningPath, PathStep };
export type { SearchKind, SearchRecord } from "./search-data";
export { branches, learningPaths, getLearningPath, getPathBranchIds };

export interface KnowledgeEntry extends EntryManifest, Omit<EntryContent, "slug"> {}

export interface ReferenceSection {
  href: string;
  title: string;
  countLabel: string;
  summary: string;
  useWhen: string;
}

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

export function resolveEntries(slugs: string[]) {
  return slugs.map((slug) => entryBySlug.get(slug)).filter((entry): entry is KnowledgeEntry => Boolean(entry));
}

export function isCoreEntry(slug: string) {
  return coreEntrySlugs.has(slug);
}

export interface CompanionLink {
  label: string;
  href: string;
}

export interface CompanionGroup {
  kind: "对照" | "案例" | "术语";
  links: CompanionLink[];
}

// 学习路径步骤的配套速查：从术语 seeAlso、对照两端与案例透镜反查，指向栏目页锚点
export function getCompanionGroupsForEntry(slug: string): CompanionGroup[] {
  const comparisons = conceptComparisons
    .filter((comparison) => comparison.left.entrySlug === slug || comparison.right.entrySlug === slug)
    .map((comparison) => ({ label: `${comparison.left.label}与${comparison.right.label}`, href: `/comparisons#${comparison.slug}` }));
  const cases = argumentCases
    .filter((argumentCase) => argumentCase.lenses.some((lens) => lens.entrySlug === slug))
    .map((argumentCase) => ({ label: argumentCase.title, href: `/cases#${argumentCase.slug}` }));
  const terms = glossaryTerms
    .filter((term) => term.seeAlso.includes(slug))
    .map((term) => ({ label: term.term, href: `/glossary#${glossaryTermId(term)}` }));
  const groups: CompanionGroup[] = [
    { kind: "对照", links: comparisons },
    { kind: "案例", links: cases },
    { kind: "术语", links: terms },
  ];
  return groups.filter((group) => group.links.length > 0);
}

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
  if (knowledgeEntries.length !== 40) throw new Error(`Expected 40 knowledge entries, found ${knowledgeEntries.length}.`);
  if (learningPaths.length !== 4) throw new Error(`Expected 4 learning paths, found ${learningPaths.length}.`);

  for (const content of contentRecords) {
    if (!entryManifest.some((entry) => entry.slug === content.slug)) throw new Error(`Content has no manifest entry: ${content.slug}`);
  }

  for (const entry of knowledgeEntries) {
    for (const slug of [...entry.prerequisiteSlugs, ...entry.relatedSlugs]) {
      if (slug === entry.slug) throw new Error(`Entry cannot reference itself: ${entry.slug}`);
      if (!entryBySlug.has(slug)) throw new Error(`Unknown relation ${slug} from ${entry.slug}`);
    }
    if ((entry.objectives?.length ?? 0) < 2) throw new Error(`Entry ${entry.slug} needs at least two objectives.`);
    for (const formula of entry.formulas ?? []) validateFormula(formula, entry.slug);
    for (const example of entry.workedExamples ?? []) {
      for (const formula of example.formulas ?? []) validateFormula(formula, `${entry.slug}/${example.title}`);
    }
  }

  const expectedPathLengths = [8, 9, 9, 10];
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
