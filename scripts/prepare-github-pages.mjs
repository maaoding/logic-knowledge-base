import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const clientDirectory = path.join(projectRoot, "dist", "client");
const practiceDirectory = path.join(projectRoot, "apps", "practice", "dist");

if (!existsSync(path.join(clientDirectory, "index.html"))) {
  throw new Error("Pages artifact is missing dist/client/index.html");
}

const nestedBasePathDirectory = path.join(clientDirectory, "logic-knowledge-base");
if (existsSync(nestedBasePathDirectory)) {
  for (const entry of readdirSync(nestedBasePathDirectory)) {
    cpSync(
      path.join(nestedBasePathDirectory, entry),
      path.join(clientDirectory, entry),
      { recursive: true, force: true },
    );
  }
  rmSync(nestedBasePathDirectory, { recursive: true, force: true });
}

if (!existsSync(path.join(practiceDirectory, "index.html"))) {
  throw new Error("Pages artifact is missing apps/practice/dist/index.html");
}
cpSync(practiceDirectory, path.join(clientDirectory, "practice"), { recursive: true, force: true });

function collectHtmlFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...collectHtmlFiles(entryPath));
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(entryPath);
  }
  return files;
}

for (const htmlFile of collectHtmlFiles(clientDirectory)) {
  const relativePath = path.relative(clientDirectory, htmlFile);
  if (
    relativePath === "index.html" ||
    relativePath === "404.html" ||
    relativePath.endsWith(`${path.sep}index.html`)
  ) {
    continue;
  }

  const routeDirectory = path.join(path.dirname(htmlFile), path.basename(htmlFile, ".html"));
  mkdirSync(routeDirectory, { recursive: true });
  cpSync(htmlFile, path.join(routeDirectory, "index.html"), { force: true });
}

writeFileSync(path.join(clientDirectory, ".nojekyll"), "", "utf8");

for (const requiredPath of [
  "index.html",
  "404.html",
  "start/index.html",
  "branches/foundations/index.html",
  "practice/index.html",
  "_next/static",
]) {
  if (!existsSync(path.join(clientDirectory, requiredPath))) {
    throw new Error(`Pages artifact is missing ${requiredPath}`);
  }
}

const htmlCount = collectHtmlFiles(clientDirectory).length;
console.log(`Prepared GitHub Pages artifact: ${htmlCount} HTML files, static assets flattened, route indexes generated.`);
