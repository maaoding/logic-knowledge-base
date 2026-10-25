import { entryManifest, entryPath, type PracticeQuestion } from "@logic/domain";

const knowledgeBaseOrigin = import.meta.env.VITE_KNOWLEDGE_BASE_URL ?? "http://localhost:3000/";

export function absoluteKnowledgeUrl(path = "/") {
  return new URL(path.replace(/^\//, ""), knowledgeBaseOrigin.endsWith("/") ? knowledgeBaseOrigin : `${knowledgeBaseOrigin}/`).href;
}

export function knowledgeUrlForQuestion(question: PracticeQuestion) {
  const entry = entryManifest.find((candidate) => candidate.slug === question.entrySlug);
  return entry ? absoluteKnowledgeUrl(entryPath(entry)) : absoluteKnowledgeUrl();
}
