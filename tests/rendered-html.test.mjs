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
  assert.match(html, /40(?:\s|<!-- -->)*个知识条目/);
  assert.match(html, /进入分支练习站/);
  assert.match(html, /搜索逻辑学知识/);
  assert.match(html, /property="og:image" content="http:\/\/localhost:3000\/og.png"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.doesNotMatch(html, /结构原型|样例内容|codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("serves a complete sitemap and project-managed robots rules", async () => {
  const sitemapResponse = await render("/sitemap.xml");
  assert.equal(sitemapResponse.status, 200);
  assert.match(sitemapResponse.headers.get("content-type") ?? "", /^application\/xml\b/i);

  const sitemapXml = await sitemapResponse.text();
  const urls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.equal(urls.length, 62);
  assert.equal(new Set(urls).size, 62);
  for (const url of [
    "http://localhost:3000/",
    "http://localhost:3000/branches/foundations",
    "http://localhost:3000/concepts/argument-structure",
    "http://localhost:3000/paths/argument-to-validity",
    "http://localhost:3000/fallacies/straw-man",
    "http://localhost:3000/paths/real-arguments-and-fallacies",
    "http://localhost:3000/resources",
    "http://localhost:3001/",
  ]) {
    assert.ok(urls.includes(url), url);
  }
  assert.doesNotMatch(sitemapXml, /<(?:lastmod|changefreq|priority)>/i);

  const robotsResponse = await render("/robots.txt");
  assert.equal(robotsResponse.status, 200);
  assert.match(robotsResponse.headers.get("content-type") ?? "", /^text\/plain\b/i);
  assert.equal(
    await robotsResponse.text(),
    "User-Agent: *\nAllow: /\n\nSitemap: http://localhost:3000/sitemap.xml\n",
  );
});

test("publishes favicon and Apple touch icon metadata with valid assets", async () => {
  const response = await render();
  const html = await response.text();
  assert.match(html, /<link rel="icon" href="\/icon\.png\?[a-f0-9]+" type="image\/png" sizes="512x512"\/>/i);
  assert.match(html, /<link rel="icon" href="\/favicon\.ico\?[a-f0-9]+" type="image\/x-icon" sizes="48x48"\/>/i);
  assert.match(html, /<link rel="apple-touch-icon" href="\/apple-icon\.png\?[a-f0-9]+" type="image\/png" sizes="180x180"\/>/i);

  for (const [path, contentType] of [
    ["/favicon.ico", "image/x-icon"],
    ["/icon.png", "image/png"],
    ["/apple-icon.png", "image/png"],
  ]) {
    const assetResponse = await render(path);
    assert.equal(assetResponse.status, 200, path);
    assert.match(assetResponse.headers.get("content-type") ?? "", new RegExp(`^${contentType.replace("/", "\\/")}\\b`, "i"), path);
    assert.ok((await assetResponse.arrayBuffer()).byteLength > 0, path);
  }

  const [iconPng, appleIconPng, favicon] = await Promise.all([
    readFile(new URL("../app/icon.png", import.meta.url)),
    readFile(new URL("../app/apple-icon.png", import.meta.url)),
    readFile(new URL("../app/favicon.ico", import.meta.url)),
  ]);
  assert.deepEqual([iconPng.readUInt32BE(16), iconPng.readUInt32BE(20)], [512, 512]);
  assert.deepEqual([appleIconPng.readUInt32BE(16), appleIconPng.readUInt32BE(20)], [180, 180]);
  assert.equal(favicon.readUInt16LE(0), 0);
  assert.equal(favicon.readUInt16LE(2), 1);
  assert.equal(favicon.readUInt16LE(4), 3);
  const icoSizes = Array.from({ length: 3 }, (_, index) => {
    const offset = 6 + index * 16;
    return [favicon[offset] || 256, favicon[offset + 1] || 256];
  });
  assert.deepEqual(icoSizes, [[16, 16], [32, 32], [48, 48]]);
});

test("renders all branches, all 40 entry routes, and all learning paths", async () => {
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

  assert.equal(entryRoutes.size, 40);
  for (const route of entryRoutes) {
    const response = await render(route);
    assert.equal(response.status, 200, route);
  }

  const otherRoutes = [
    "/start", "/paths", "/paths/argument-to-validity",
    "/paths/proposition-to-quantifier", "/paths/induction-and-real-arguments",
    "/paths/real-arguments-and-fallacies",
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
  const [layout, page, packageJsonText, practicePackageText] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../apps/practice/package.json", import.meta.url), "utf8"),
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
  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
});
