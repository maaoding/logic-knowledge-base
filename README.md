# 逻辑学知识库

一个面向零基础自学者的本地双应用知识库：主站系统组织逻辑学内容，分支练习站负责即时检验理解。两个应用独立构建，通过普通链接互相跳转，不使用 iframe、账号、数据库或运行时 API。

## 当前包含

- 十个学科分支与 44 篇知识条目，覆盖现代逻辑分支与中国、印度、希腊、中世纪与现代数理传统。每篇条目包含学习目标、讲解小节、公式（适用时）、两道逐步例题、两条常见误区、一句话结论、两道可折叠自测与带解析的思考练习。
- 术语表收录 64 个常用术语，按拼音顺序排列，附易混提示并链回正文条目。
- 易混概念对照以 17 组成对概念呈现共同点、关键差异与易混场景。
- 论证分析案例用重构、证据检查、推理检查与谬误检查等透镜拆解 14 个明确标注为虚构的真实感论证，结尾留开放式追问。
- 学习资源按在线百科、开放教材、交互工具与课程视频分组，收录 10 项资源，逐项附使用建议与注意事项。
- 六条学习路径，分别包含 8、9、9、10、11、9 个步骤；路径成员自动采用核心条目模板，每个步骤附可直达的易混对照、论证案例与术语速查链接，路径结尾列出所涉练习分支的直达入口。
- 主站包含覆盖知识条目、术语、概念对照、案例与资源的本地搜索，以及关系导航、KaTeX HTML/MathML 公式、响应式明暗主题和自定义 404。
- 练习站包含 54 道题，每个分支的题数比条目数多一（4–9 题），每篇知识条目至少对应一题，每分支至少两道单选和一道多选，提交后立即显示解析与知识条目链接。
- 共享领域包统一维护分支、条目清单、路由和练习题，不另复制搜索目录。

答题进度只保存在当前浏览器的本地存储中，刷新、关闭或切换分支后仍可继续；点击“重新练习本分支”或清除浏览器数据即删除。答题数据不会上传或收集；明暗主题偏好同样只保存在浏览器本地。

## 本地运行

```powershell
npm run dev
npm run dev:practice
npm run dev:all

npm run lint
npm run typecheck
npm run build:all
npm run test:all
```

主站默认运行在 `http://localhost:3000`，练习站默认运行在 `http://localhost:3001`。可用 `NEXT_PUBLIC_PRACTICE_SITE_URL` 和 `VITE_KNOWLEDGE_BASE_URL` 覆盖双向地址。
如需为社交预览生成绝对地址，可用 `NEXT_PUBLIC_SITE_URL` 指定主站的可信来源；本地默认使用 `http://localhost:3000/`。

构建和测试使用 Node.js 22.13 或更高版本；仓库不包含账号、统计或服务器端持久化进度配置。

## 部署

线上发布由 `.github/workflows/pages.yml` 驱动。推送到 `main`（或手动 `workflow_dispatch`）后，GitHub Actions 在 Node.js 22 上执行 `npm ci`，用 `actions/configure-pages` 推导站点地址与 base path，再依次执行：

1. `npm run build`：主站构建。`GITHUB_PAGES=true` 时 `next.config.ts` 切换为 `output: "export"`，并按 `GITHUB_PAGES_BASE_PATH` 设置 `basePath`。
2. `npm run build:practice`：练习站 Vite 构建，输出 `apps/practice/dist`。这两步合起来等价于本地的 `npm run build:all`。
3. `npm run prepare:pages`：把练习站复制到 `dist/client/practice`，把每个 HTML 路由生成为目录下的 `index.html`，写入 `.nojekyll`，必要时从构建产物补齐 `sitemap.xml` 与 `robots.txt`，并校验产物内所有站内链接可解析。
4. `actions/upload-pages-artifact` 上传 `dist/client`，随后 `actions/deploy-pages` 发布。

构建期环境变量（workflow 自动注入，本地复现时手动设置）：

- `NEXT_PUBLIC_SITE_URL`：主站可信来源，决定 `metadataBase` 以及 canonical、sitemap 的绝对地址。
- `NEXT_PUBLIC_PRACTICE_SITE_URL`：练习站对外地址，主站上的练习入口使用。
- `VITE_KNOWLEDGE_BASE_URL`：练习站回链主站的地址。
- `GITHUB_PAGES_BASE_PATH`：Pages 的 base path，须为空，或以单个 `/` 开头且不带尾斜杠。
- `GITHUB_PAGES`：设为 `true` 时主站切换为静态导出模式。

本地复现同样的 Pages 产物（PowerShell，示例假定站点位于域名根）：

```powershell
$env:GITHUB_PAGES = "true"
$env:GITHUB_PAGES_BASE_PATH = ""
$env:NEXT_PUBLIC_SITE_URL = "http://localhost:3000/"
$env:NEXT_PUBLIC_PRACTICE_SITE_URL = "http://localhost:3000/practice/"
npm run build
$env:VITE_KNOWLEDGE_BASE_URL = "http://localhost:3000/"
npm run build:practice
npm run prepare:pages
```

产物位于 `dist/client`（已在 `.gitignore` 中忽略）。仓库里的 `worker/index.ts` 与根 `vite.config.ts` 的 Cloudflare 插件是另一套构建目标，供 `npm run dev` 等本地开发使用；上述 Pages workflow 上传的是 `dist/client` 静态产物，不会用到它。
