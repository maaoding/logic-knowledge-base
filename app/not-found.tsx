import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="not-found shell">
      <p className="not-found-code">404</p>
      <p className="eyebrow">无效路径不产生结论</p>
      <h1>这里没有对应的知识条目</h1>
      <p>返回学科地图，或从零基础路径重新选择一个有效入口。</p>
      <div className="hero-actions"><Link className="primary-action" href="/">返回首页</Link><Link className="text-action" href="/start">从这里开始</Link></div>
    </main>
  );
}
