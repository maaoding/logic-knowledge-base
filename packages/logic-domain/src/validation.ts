import { branches, entryManifest } from "./catalog";
import { learningPaths } from "./paths";
import { practiceQuestions } from "./questions";

function assertDomainIntegrity() {
  if (branches.length !== 10) throw new Error(`Expected 10 branches, found ${branches.length}.`);
  if (entryManifest.length !== 40) throw new Error(`Expected 40 entries, found ${entryManifest.length}.`);
  const expectedQuestionTotal = entryManifest.length + branches.length;
  if (practiceQuestions.length !== expectedQuestionTotal) {
    throw new Error(`Expected ${expectedQuestionTotal} questions, found ${practiceQuestions.length}.`);
  }

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
    const expectedBranchQuestions = entries.length + 1;
    if (questions.length !== expectedBranchQuestions) {
      throw new Error(`Branch ${branch.id} must contain exactly ${expectedBranchQuestions} questions.`);
    }
    if (singleCount < 2 || multipleCount < 1) {
      throw new Error(`Branch ${branch.id} must contain at least 2 single and 1 multiple question.`);
    }
    for (const entry of entries) {
      if (!questions.some((question) => question.entrySlug === entry.slug)) {
        throw new Error(`Entry ${entry.slug} in branch ${branch.id} has no practice question.`);
      }
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

  const pathSlugs = new Set<string>();
  for (const path of learningPaths) {
    if (pathSlugs.has(path.slug)) throw new Error(`Duplicate learning path slug: ${path.slug}`);
    pathSlugs.add(path.slug);
    const stepSlugs = new Set<string>();
    for (const step of path.steps) {
      if (!entryBySlug.has(step.entrySlug)) throw new Error(`Unknown path step ${step.entrySlug} in ${path.slug}`);
      if (stepSlugs.has(step.entrySlug)) throw new Error(`Duplicate path step ${step.entrySlug} in ${path.slug}`);
      stepSlugs.add(step.entrySlug);
    }
  }
}

assertDomainIntegrity();
