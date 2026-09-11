// 本地搜索索引：只依赖数据模块，不引 katex——练习弹层在客户端按需动态加载本模块
import {
  branches,
  entryManifest,
  entryPath,
  type EntryKind,
} from "@logic/domain";
import { argumentCases } from "./content/cases";
import { conceptComparisons } from "./content/comparisons";
import { glossaryTermId, glossaryTerms } from "./content/glossary";
import { resourceGroupId, resourceGroups } from "./content/resources";

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

const branchById = new Map(branches.map((branch) => [branch.id, branch]));

const entrySearchIndex: SearchRecord[] = entryManifest.map((entry) => ({
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

if (new Set(searchIndex.map((record) => record.slug)).size !== searchIndex.length) {
  throw new Error("Search record slugs must be unique.");
}
