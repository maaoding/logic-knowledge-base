import { branches, entryManifest } from "./catalog";
import { practiceQuestions } from "./questions";

function assertDomainIntegrity() {
  if (branches.length !== 10) throw new Error(`Expected 10 branches, found ${branches.length}.`);
  if (entryManifest.length !== 36) throw new Error(`Expected 36 entries, found ${entryManifest.length}.`);
  if (practiceQuestions.length !== 30) throw new Error(`Expected 30 questions, found ${practiceQuestions.length}.`);

  const branchIds = new Set(branches.map((branch) => branch.id));
  const entryBySlug = new Map(entryManifest.map((entry) => [entry.slug, entry]));
  const questionIds = new Set<string>();

  if (branchIds.size !== branches.length) throw new Error("Branch ids must be unique.");
  if (entryBySlug.size !== entryManifest.length) throw new Error("Entry slugs must be unique.");

  for (const branch of branches) {
    const entries = entryManifest.filter((entry) => entry.branchId === branch.id);
    if (entries.length < 3) throw new Error(`Branch ${branch.id} must contain at least 3 entries.`);

    const questions = practiceQuestions.filter((question) => question.branchId === branch.id);
    const singleCount = questions.filter((question) => question.kind === "single").length;
    const multipleCount = questions.filter((question) => question.kind === "multiple").length;
    if (questions.length !== 3 || singleCount !== 2 || multipleCount !== 1) {
      throw new Error(`Branch ${branch.id} must contain exactly 2 single and 1 multiple question.`);
    }
  }

  for (const question of practiceQuestions) {
    if (questionIds.has(question.id)) throw new Error(`Duplicate question id: ${question.id}`);
    questionIds.add(question.id);

    const entry = entryBySlug.get(question.entrySlug);
    if (!entry) throw new Error(`Unknown entry ${question.entrySlug} for question ${question.id}`);
    if (entry.branchId !== question.branchId) throw new Error(`Question ${question.id} points outside its branch.`);
    if (question.options.length < 3 || question.options.length > 5) throw new Error(`Question ${question.id} must have 3-5 options.`);

    const optionIds = new Set(question.options.map((option) => option.id));
    if (optionIds.size !== question.options.length) throw new Error(`Question ${question.id} has duplicate option ids.`);
    if (question.correctOptionIds.some((id) => !optionIds.has(id))) throw new Error(`Question ${question.id} has an unknown correct option.`);
    if (question.kind === "single" && question.correctOptionIds.length !== 1) throw new Error(`Single question ${question.id} must have one answer.`);
    if (question.kind === "multiple" && (question.correctOptionIds.length < 2 || question.correctOptionIds.length >= question.options.length)) {
      throw new Error(`Multiple question ${question.id} must have 2 or more, but not all, answers.`);
    }
    if (!question.explanation.trim()) throw new Error(`Question ${question.id} needs an explanation.`);
  }
}

assertDomainIntegrity();
