import type { Metadata } from "next";
import { resourceGroupId, resourceGroups, resourcesIntro } from "../../lib/content/resources";

export const metadata: Metadata = {
  title: "学习资源",
  description: "按用途分组的外部逻辑学学习资源，附使用建议与注意事项。",
};

export default function ResourcesPage() {
  return (
    <main id="main-content" className="page-shell shell">
      <header className="page-header">
        <p className="eyebrow">延伸</p>
        <h1>学习资源</h1>
        <p>{resourcesIntro}</p>
      </header>

      <div className="resource-groups">
        {resourceGroups.map((group) => (
          <section className="resource-group" key={group.slug} id={resourceGroupId(group)}>
            <h2>{group.heading}</h2>
            <p className="resource-group-intro">{group.intro}</p>
            <ul>
              {group.items.map((item) => (
                <li key={item.url}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.title}<span className="sr-only">（在新标签页打开）</span>
                  </a>
                  <p>{item.note}</p>
                  {item.caution ? <p className="resource-caution"><strong>注意：</strong>{item.caution}</p> : null}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
