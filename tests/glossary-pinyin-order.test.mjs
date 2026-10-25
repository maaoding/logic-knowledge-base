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

  // 整表逐对断言会被多音字拖垮——排序器把“重言式”读作 zhòng、
  // 并且把“幸存者偏差”（xìng）排在“形式系统”（xíng）之后，与术语表采用的读音不一致。
  // 这两对进白名单，其余相邻逆序都算失败（见下方全表测试）。
  const collator = new Intl.Collator("zh-Hans-u-co-pinyin");
  assert.ok(collator.compare("可靠性定理", "可满足性") < 0);

  const html = await (await render("/glossary")).text();
  const reliableIndex = html.indexOf('id="term-可靠性定理"');
  const satisfiableIndex = html.indexOf('id="term-可满足性"');
  assert.ok(reliableIndex >= 0 && satisfiableIndex >= 0, "术语表页面应渲染这两条术语");
  assert.ok(reliableIndex < satisfiableIndex, "渲染顺序应与数据顺序一致");
});

const collator = new Intl.Collator("zh-Hans-u-co-pinyin");
const pinyinOrderExceptions = [
  ["重言式", "存在量词"],
  ["幸存者偏差", "形式系统"],
];

test("keeps the whole glossary in pinyin order outside documented exceptions", () => {
  const terms = glossaryTermsInSourceOrder();
  assert.ok(terms.length >= 2, "术语表数据不应为空");
  for (let i = 0; i < terms.length - 1; i++) {
    const [current, next] = [terms[i], terms[i + 1]];
    const exempt = pinyinOrderExceptions.some(([a, b]) => a === current && b === next);
    if (exempt) continue;
    assert.ok(
      collator.compare(current, next) <= 0,
      `术语表第 ${i + 1}-${i + 2} 项逆序：${current} 应排在 ${next} 之前（多音字豁免需登记到 pinyinOrderExceptions）`,
    );
  }
});
