import Link from "next/link";
import { practiceQuestions } from "@logic/domain";
import { knowledgeEntries } from "../lib/catalog";
import { practiceSiteUrl } from "../lib/site-links";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div>
          <strong>逻辑学知识库</strong>
          <p>以学科地图、关联条目和学习路径组织逻辑学入门。</p>
        </div>
        <nav aria-label="页脚导航">
          <Link href="/start">从这里开始</Link>
          <Link href="/paths">学习路径</Link>
          <Link href="/glossary">术语表</Link>
          <Link href="/branches/history">逻辑学史</Link>
          <a href={practiceSiteUrl()}>分支练习站</a>
        </nav>
        <p className="footer-note">{knowledgeEntries.length} 个知识条目与 {practiceQuestions.length} 道分支练习均在本地运行，不收集答题数据。</p>
      </div>
    </footer>
  );
}
