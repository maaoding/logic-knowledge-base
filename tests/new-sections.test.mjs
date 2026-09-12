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
  assert.match(html, /id="term-红鲱鱼"/);
  assert.match(html, /id="term-循环论证"/);
  assert.match(html, /用“经书无误”证明神存在/);
});

test("renders concept comparisons with shared, difference and watch fields", async () => {
  const response = await render("/comparisons");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /易混概念对照/);
  assert.match(html, /快速跳转/);
  assert.match(html, /href="#deduction-vs-induction"/);
  assert.match(html, /共同点/);
  assert.match(html, /关键差异/);
  assert.match(html, /易混场景/);
  assert.match(html, /de re 从物/);
  // 对照标题的可见文本是“左标签 vs 右标签”（“与”仅存在于 sr-only）
  assert.match(html, /id="provability-vs-truth-title"/);
  assert.match(html, /id="classical-vs-intuitionistic-consequence-title"/);
  assert.match(html, /id="syntax-vs-semantics-title"/);
  assert.match(html, /id="consistency-vs-completeness-title"/);
  assert.match(html, /存在为真却不可证明的算术命题/);
  assert.match(html, /排中律 P∨¬P 不再是定理/);
  assert.match(html, /拿出一列推导是语法，拿出模型分析是语义/);
  assert.match(html, /查一致性找“双双可证”/);
  assert.match(html, /aria-labelledby="contradictory-vs-contrary-title"/);
  assert.match(html, /<h2 class="comparison-pair" id="contradictory-vs-contrary-title">/);
});

test("renders argument analysis cases with lenses and open questions", async () => {
  const response = await render("/cases");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /论证分析案例/);
  assert.match(html, /快速跳转/);
  assert.match(html, /href="#app-review-claim"/);
  assert.match(html, /继续追问/);
  assert.match(html, /九成用户都满意/);
  assert.match(html, /检测准确率 99%/);
  assert.match(html, /延长两小时，就是要求全年不闭馆/);
  assert.match(html, /你没学过财务，预算就轮不到你质疑/);
  assert.match(html, /不全面禁手机，课堂就只能失控/);
  assert.match(html, /打卡用户成绩高，所以打卡让人成绩提高/);
  assert.match(html, /没有任何漏洞能逃过数学的检验/);
  assert.match(html, /要么按期上线，要么项目失败/);
  assert.match(html, /id="formal-verification-claim"/);
  assert.match(html, /id="excluded-middle-deadline"/);
  assert.match(html, /id="no-complaints-records"/);
  assert.match(html, /id="praised-a-finalist"/);
  assert.match(html, /id="smoke-on-the-mountain"/);
  assert.match(html, /id="possibility-excuse"/);
  assert.match(html, /id="no-standard-answer"/);
  assert.match(html, /我只是说有可能/);
  assert.match(html, /这句话当时排除了哪些情形/);
  assert.match(html, /没有唯一答案不等于没有对错/);
  assert.match(html, /有效但前提假，结论照样不可靠/);
  assert.match(html, /量词顺序一换，承诺强度整个改变/);
  assert.match(html, /凡冒烟之处皆有燃烧/);
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
  // 条目页回指所属学习路径与步骤序号
  assert.match(html, /所属路径/);
  assert.match(html, /href="\/paths\/argument-to-validity"/);
  assert.match(html, /从论证到有效性(?:\s|<!-- -->)*第(?:\s|<!-- -->)*3(?:\s|<!-- -->)*步/);
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
  assert.match(html, /搜索覆盖(?:\s|<!-- -->)*149(?:\s|<!-- -->)*项本地内容/);
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

test("presents the two new learning paths with steps, prerequisites and companions", async () => {
  const [formalResponse, historyResponse] = await Promise.all([
    render("/paths/formal-systems-tour"),
    render("/paths/logic-across-civilizations"),
  ]);
  assert.equal(formalResponse.status, 200);
  const formalHtml = await formalResponse.text();
  assert.match(formalHtml, /形式系统进阶/);
  assert.match(formalHtml, /开始前建议/);
  assert.match(formalHtml, /href="\/systems\/normal-modal-systems"/);
  assert.match(formalHtml, /href="\/concepts\/computability"/);
  assert.match(formalHtml, /配套速查/);

  assert.equal(historyResponse.status, 200);
  const historyHtml = await historyResponse.text();
  assert.match(historyHtml, /逻辑的文明史/);
  assert.match(historyHtml, /href="\/history\/medieval-logic"/);
  assert.match(historyHtml, /href="\/history\/mohist-logic"/);
  assert.match(historyHtml, /配套速查/);
});

test("renders the four new entries with their signature content", async () => {
  const [modalResponse, computabilityResponse, manyValuedResponse, medievalResponse] = await Promise.all([
    render("/systems/normal-modal-systems"),
    render("/concepts/computability"),
    render("/systems/many-valued-logic"),
    render("/history/medieval-logic"),
  ]);

  for (const response of [modalResponse, computabilityResponse, manyValuedResponse, medievalResponse]) {
    assert.equal(response.status, 200);
  }

  const modalHtml = await modalResponse.text();
  assert.match(modalHtml, /正规模态系统/);
  assert.match(modalHtml, /katex-mathml/);
  assert.match(modalHtml, /必然化规则有严格的适用范围/);
  assert.match(modalHtml, /所属路径/);

  const computabilityHtml = await computabilityResponse.text();
  assert.match(computabilityHtml, /可计算性与可判定性/);
  assert.match(computabilityHtml, /两个方向都撞墙，唯一的出路是 H 根本不存在/);

  const manyValuedHtml = await manyValuedResponse.text();
  assert.match(manyValuedHtml, /多值逻辑/);
  assert.match(manyValuedHtml, /K3 没有重言式/);

  const medievalHtml = await medievalResponse.text();
  assert.match(medievalHtml, /中世纪逻辑/);
  assert.match(medievalHtml, /指代（suppositio）学说/);
});

test("links each path step to companion comparisons, cases and glossary terms", async () => {
  const response = await render("/paths/argument-to-validity");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /配套速查/);
  assert.match(html, /每个步骤的对照、案例与术语/);
  assert.match(html, /href="\/comparisons#deduction-vs-induction"/);
  assert.match(html, /href="\/cases#app-review-claim"/);
  assert.match(html, /href="\/glossary#term-[^"]+"/);
  for (const kind of ["对照", "案例", "术语"]) {
    assert.match(html, new RegExp(`class="companion-kind">${kind}`), kind);
  }
});

test("offers direct practice branch links on learning path pages", async () => {
  const response = await render("/paths/argument-to-validity");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /完成路径后，回到分支检验。/);
  // JSX 相邻文本节点之间会出现 <!-- --> 注释，如“练习<!-- -->逻辑基础”
  assert.match(html, /练习(?:<!-- -->)?逻辑基础/);
  for (const branchId of ["foundations", "traditional", "propositional"]) {
    assert.match(html, new RegExp(`\\?branch=${branchId}`), branchId);
  }
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
