import assert from "node:assert/strict";
import test from "node:test";
import { pathToFileURL } from "node:url";

async function loadWorker() {
  const workerUrl = pathToFileURL("dist/server/index.js", { windows: true });
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker;
}

async function render(path) {
  const worker = await loadWorker();
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the glossary with definitions and entry links", async () => {
  const response = await render("/glossary");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /术语表/);
  assert.match(html, /按拼音顺序排列/);
  assert.match(html, /易混提示/);
  assert.match(html, /href="\/concepts\/argument-structure"/);
  assert.match(html, /id="term-有效性"/);
});

test("renders concept comparisons with shared, difference and watch fields", async () => {
  const response = await render("/comparisons");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /易混概念对照/);
  assert.match(html, /共同点/);
  assert.match(html, /关键差异/);
  assert.match(html, /易混场景/);
  assert.match(html, /de re 从物/);
  assert.match(html, /aria-labelledby="contradictory-vs-contrary-title"/);
  assert.match(html, /<h2 class="comparison-pair" id="contradictory-vs-contrary-title">/);
});

test("renders argument analysis cases with lenses and open questions", async () => {
  const response = await render("/cases");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /论证分析案例/);
  assert.match(html, /继续追问/);
  assert.match(html, /九成用户都满意/);
  assert.match(html, /检测准确率 99%/);
  assert.match(html, /延长两小时，就是要求全年不闭馆/);
  assert.match(html, /你没学过财务，预算就轮不到你质疑/);
  assert.match(html, /不全面禁手机，课堂就只能失控/);
  assert.match(html, /打卡用户成绩高，所以打卡让人成绩提高/);
});

test("renders grouped learning resources with external links", async () => {
  const response = await render("/resources");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /学习资源/);
  assert.match(html, /plato\.stanford\.edu/);
  assert.match(html, /注意/);
  assert.match(html, /id="resource-open-textbooks"/);
  assert.match(html, /在新标签页打开/);
});

test("renders key takeaway and self-check blocks on entry pages", async () => {
  const response = await render("/concepts/truth-validity-soundness");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /一句话结论/);
  assert.match(html, /快速自测/);
  assert.match(html, /<details class="self-check-item"/);
});

test("integrates the reference sections into navigation and the homepage", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /查阅与应用/);
  assert.match(html, /卡住时，不必从头重读/);
  for (const href of ["/glossary", "/comparisons", "/cases", "/resources"]) {
    assert.match(html, new RegExp(`href="${href}"`), href);
  }
  assert.match(html, /搜索覆盖(?:\s|<!-- -->)*128(?:\s|<!-- -->)*项本地内容/);
});

test("explains the four learning stages without misstating path length", async () => {
  const response = await render("/paths");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /起点、核心、延伸与整合四个阶段/);
  assert.doesNotMatch(html, /每条路径只有四步/);
});

test("shows prerequisite guidance before advanced learning paths", async () => {
  const response = await render("/paths/proposition-to-quantifier");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /开始前建议/);
  assert.match(html, /href="\/concepts\/truth-validity-soundness"/);
  assert.match(html, /真值、有效性与健全性/);
});

test("keeps corrected logic distinctions visible in reader-facing pages", async () => {
  const [quantifierResponse, squareResponse, modalResponse, relevanceResponse] = await Promise.all([
    render("/methods/multiple-quantification"),
    render("/concepts/categorical-propositions"),
    render("/systems/possible-worlds-semantics"),
    render("/systems/relevant-and-paraconsistent"),
  ]);

  for (const response of [quantifierResponse, squareResponse, modalResponse, relevanceResponse]) {
    assert.equal(response.status, 200);
  }

  assert.match(await quantifierResponse.text(), /内层 ∃x 会遮蔽外层 ∀x/);
  assert.match(await squareResponse.text(), /A 真无条件只推出其矛盾命题 O 假/);
  assert.match(await modalResponse.text(), /自反性保证 P→◇P，却不保证 ◇P→P/);
  assert.match(await relevanceResponse.text(), /P→\(Q→P\) 的外层前件 P 与外层后件 Q→P 实际共享 P/);
});

test("keeps the boundaries of the four new fallacy entries visible", async () => {
  const [strawManResponse, adHominemResponse, dilemmaResponse, causalResponse] = await Promise.all([
    render("/fallacies/straw-man"),
    render("/fallacies/ad-hominem"),
    render("/fallacies/false-dilemma"),
    render("/fallacies/causal-misreasoning"),
  ]);

  for (const response of [strawManResponse, adHominemResponse, dilemmaResponse, causalResponse]) {
    assert.equal(response.status, 200);
  }

  assert.match(await strawManResponse.text(), /指出稻草人后，原主张就自动成立/);
  assert.match(await adHominemResponse.text(), /来源信息有时确实相关/);
  assert.match(await dilemmaResponse.text(), /真实两难并不是谬误/);
  assert.match(await causalResponse.text(), /相关是发现和检验因果假设的重要起点/);
});
