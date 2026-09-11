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

test("keeps README counts in sync with rendered data", async () => {
  const home = await (await render("/")).text();
  // JSX 插值与文本节点之间会出现 <!-- --> 注释，正则需容忍
  const pick = (pattern) => Number(home.match(pattern)?.[1]);
  const rendered = {
    entries: pick(/(\d+)(?:\s|<!-- -->)*个知识条目/),
    questions: pick(/(\d+)(?:\s|<!-- -->)*道分支练习/),
    terms: pick(/(\d+)(?:\s|<!-- -->)*个术语/),
    comparisons: pick(/(\d+)(?:\s|<!-- -->)*组对照/),
    cases: pick(/(\d+)(?:\s|<!-- -->)*个案例/),
    resources: pick(/(\d+)(?:\s|<!-- -->)*项资源/),
  };
  for (const [name, value] of Object.entries(rendered)) {
    assert.ok(Number.isInteger(value) && value > 0, `首页应渲染 ${name} 计数`);
  }

  const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");
  const expectations = [
    [rendered.entries, /(\d+) 篇知识条目/, "篇知识条目"],
    [rendered.questions, /练习站包含 (\d+) 道题/, "道题"],
    [rendered.terms, /(\d+) 个常用术语/, "个常用术语"],
    [rendered.comparisons, /(\d+) 组成对概念/, "组成对概念"],
    [rendered.cases, /(\d+) 个明确标注为虚构/, "个明确标注为虚构"],
    [rendered.resources, /(\d+) 项资源/, "项资源"],
  ];
  for (const [expected, pattern, label] of expectations) {
    const actual = Number(readme.match(pattern)?.[1]);
    assert.equal(actual, expected, `README 的「${label}」计数（${actual}）应与渲染数据（${expected}）一致`);
  }
});
