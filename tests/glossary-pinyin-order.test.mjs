import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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

function glossaryTermsInSourceOrder() {
  const source = readFileSync(new URL("../lib/content/glossary.ts", import.meta.url), "utf8");
  return [...source.matchAll(/^ {4}term: "([^"]+)",$/gm)].map((match) => match[1]);
}

test("keeps 可靠性定理 before 可满足性 in pinyin order", async () => {
  const terms = glossaryTermsInSourceOrder();
  const reliable = terms.indexOf("可靠性定理");
  const satisfiable = terms.indexOf("可满足性");
  assert.ok(reliable >= 0 && satisfiable >= 0, "术语表数据应包含这两条术语");
  assert.ok(reliable < satisfiable, "可靠性定理（kěkào）应排在 可满足性（kěmǎn）之前");

  // 只锁定这一对：整表逐对断言会被多音字拖垮——排序器把“重言式”读作 zhòng、
  // 并且把“幸存者偏差”（xìng）排在“形式系统”（xíng）之后，与术语表采用的读音不一致
  const collator = new Intl.Collator("zh-Hans-u-co-pinyin");
  assert.ok(collator.compare("可靠性定理", "可满足性") < 0);

  const html = await (await render("/glossary")).text();
  const reliableIndex = html.indexOf('id="term-可靠性定理"');
  const satisfiableIndex = html.indexOf('id="term-可满足性"');
  assert.ok(reliableIndex >= 0 && satisfiableIndex >= 0, "术语表页面应渲染这两条术语");
  assert.ok(reliableIndex < satisfiableIndex, "渲染顺序应与数据顺序一致");
});
