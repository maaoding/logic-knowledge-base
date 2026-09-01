import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function loadWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker;
}

async function render(path = "/") {
  const worker = await loadWorker();
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the finished homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>逻辑学知识库<\/title>/i);
  assert.match(html, /为零基础读者展开一张逻辑地图/);
  assert.match(html, /学科地图/);
  assert.match(html, /36 个知识条目/);
  assert.match(html, /进入分支练习站/);
  assert.match(html, /搜索逻辑学知识/);
  assert.match(html, /property="og:image" content="http:\/\/localhost:3000\/og.png"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.doesNotMatch(html, /结构原型|样例内容|codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("renders all branches, all 36 entry routes, and all learning paths", async () => {
  const branchIds = [
    "foundations", "traditional", "propositional", "predicate", "modal",
    "inductive", "informal", "mathematical", "philosophical", "history",
  ];
  const entryRoutes = new Set();

  for (const branchId of branchIds) {
    const route = `/branches/${branchId}`;
    const response = await render(route);
    assert.equal(response.status, 200, route);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i, route);
    const html = await response.text();
    for (const match of html.matchAll(/href="(\/(?:concepts|systems|methods|fallacies|history)\/[^"?#]+)"/g)) {
      entryRoutes.add(match[1]);
    }
  }

  assert.equal(entryRoutes.size, 36);
  for (const route of entryRoutes) {
    const response = await render(route);
    assert.equal(response.status, 200, route);
  }

  const otherRoutes = [
    "/start", "/paths", "/paths/argument-to-validity",
    "/paths/proposition-to-quantifier", "/paths/induction-and-real-arguments",
  ];
  for (const route of otherRoutes) {
    const response = await render(route);
    assert.equal(response.status, 200, route);
  }

  const formulaResponse = await render("/concepts/quantifiers");
  const formulaHtml = await formulaResponse.text();
  assert.match(formulaHtml, /katex-mathml/);
  assert.match(formulaHtml, /全称量词与存在量词/);
  assert.match(formulaHtml, /去练习站检验本分支/);
  assert.doesNotMatch(formulaHtml, /property="og:image"/);
});

test("returns the custom 404 for unknown knowledge routes", async () => {
  const response = await render("/concepts/not-a-real-entry");
  assert.equal(response.status, 404);
  const html = await response.text();
  assert.match(html, /无效路径不产生结论/);
});

test("keeps the workspace local-only and exposes both application commands", async () => {
  const [layout, page, packageJsonText, practicePackageText, hosting] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../apps/practice/package.json", import.meta.url), "utf8"),
    readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
  ]);

  const packageJson = JSON.parse(packageJsonText);
  const practicePackage = JSON.parse(practicePackageText);
  assert.doesNotMatch(`${layout}\n${page}\n${packageJsonText}`, /codex-preview|SkeletonPreview|react-loading-skeleton/);
  assert.equal(packageJson.name, "logic-knowledge-base");
  assert.deepEqual(packageJson.workspaces, ["apps/practice", "packages/logic-domain"]);
  for (const script of ["dev", "dev:practice", "dev:all", "build", "build:practice", "build:all", "test:all"]) {
    assert.equal(typeof packageJson.scripts[script], "string", script);
  }
  assert.equal(practicePackage.name, "@logic/practice");
  assert.deepEqual(JSON.parse(hosting), { d1: null, r2: null });
  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
});
