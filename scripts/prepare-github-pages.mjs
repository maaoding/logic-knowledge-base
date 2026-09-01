import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const clientDirectory = path.join(projectRoot, "dist", "client");
const practiceDirectory = path.join(projectRoot, "apps", "practice", "dist");
const pagesBasePath = process.env.GITHUB_PAGES_BASE_PATH?.trim() ?? "";

if (
  pagesBasePath &&
  (!pagesBasePath.startsWith("/") || pagesBasePath.endsWith("/"))
) {
  throw new Error(
    "GITHUB_PAGES_BASE_PATH must be empty or start with one slash without a trailing slash",
  );
}

const basePathSegments = pagesBasePath.slice(1).split("/").filter(Boolean);
if (basePathSegments.some((segment) => segment === "." || segment === "..")) {
  throw new Error("GITHUB_PAGES_BASE_PATH contains an unsafe path segment");
}

if (!existsSync(path.join(clientDirectory, "index.html"))) {
  throw new Error("Pages artifact is missing dist/client/index.html");
}

const nestedBasePathDirectory = basePathSegments.length
  ? path.resolve(clientDirectory, ...basePathSegments)
  : null;
const resolvedClientDirectory = path.resolve(clientDirectory);
if (
  nestedBasePathDirectory &&
  !nestedBasePathDirectory.startsWith(`${resolvedClientDirectory}${path.sep}`)
) {
  throw new Error("Resolved GitHub Pages base path escapes dist/client");
}

if (nestedBasePathDirectory && existsSync(nestedBasePathDirectory)) {
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

function routeTargetExists(pathname) {
  let routePath = pathname;
  if (pagesBasePath) {
    if (routePath === pagesBasePath) routePath = "/";
    else if (routePath.startsWith(`${pagesBasePath}/`)) {
      routePath = routePath.slice(pagesBasePath.length);
    } else {
      return false;
    }
  }

  const relativeRoute = decodeURIComponent(routePath).replace(/^\/+/, "");
  if (!relativeRoute) return existsSync(path.join(clientDirectory, "index.html"));

  return (
    existsSync(path.join(clientDirectory, relativeRoute)) ||
    existsSync(path.join(clientDirectory, `${relativeRoute}.html`)) ||
    existsSync(path.join(clientDirectory, relativeRoute, "index.html"))
  );
}

for (const htmlFile of collectHtmlFiles(clientDirectory)) {
  const html = readFileSync(htmlFile, "utf8");
  const localReferences = html.matchAll(/(?:href|src)="(\/[^"]*)"/g);

  for (const [, reference] of localReferences) {
    const pathname = new URL(reference, "https://pages.invalid").pathname;
    if (!routeTargetExists(pathname)) {
      const relativeHtmlPath = path.relative(clientDirectory, htmlFile);
      throw new Error(
        `Pages artifact reference does not resolve: ${reference} in ${relativeHtmlPath}`,
      );
    }
  }
}

const htmlCount = collectHtmlFiles(clientDirectory).length;
console.log(
  `Prepared GitHub Pages artifact: ${htmlCount} HTML files, base path ${pagesBasePath || "/"}, static assets flattened, route indexes generated, local references verified.`,
);
