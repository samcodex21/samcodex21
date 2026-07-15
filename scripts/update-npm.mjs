import fs from "node:fs/promises";

const root = new URL("../", import.meta.url);
const readmePath = new URL("README.md", root);
const configPath = new URL("config/npm.json", root);

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function replaceBlock(readme, marker, content) {
  const start = `<!-- ${marker}:START -->`;
  const end = `<!-- ${marker}:END -->`;
  return readme.replace(new RegExp(`${start}[\\s\\S]*?${end}`), `${start}\n${content}\n${end}`);
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { "user-agent": "sam-codex-profile-updater" } });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.json();
}

async function getPackage(name) {
  const encoded = encodeURIComponent(name);
  const [latest, downloads] = await Promise.all([
    fetchJson(`https://registry.npmjs.org/${encoded}/latest`),
    fetchJson(`https://api.npmjs.org/downloads/point/last-month/${encoded}`).catch(() => ({ downloads: "" }))
  ]);
  return {
    name: latest.name,
    version: latest.version,
    description: latest.description || "",
    repository: typeof latest.repository === "string" ? latest.repository : latest.repository?.url || "",
    url: `https://www.npmjs.com/package/${latest.name}`,
    downloads: downloads.downloads
  };
}

function repoUrl(value = "") {
  return value.replace(/^git\+/, "").replace(/^git:/, "https:").replace(/\.git$/, "");
}

function render(packages) {
  if (packages.length === 0) {
    return `<table>
  <tr>
    <td width="50%"><strong>npm Package Console</strong><br /><sub>Downloads, versions, descriptions, and repository links update daily from the npm registry.</sub></td>
    <td width="50%"><strong>Release Surface</strong><br /><sub>Public packages appear as polished dashboard cards when package names are added to the registry config.</sub></td>
  </tr>
</table>`;
  }
  const rows = [];
  for (let i = 0; i < packages.length; i += 2) {
    const cells = [packages[i], packages[i + 1]].map((pkg) => {
      if (!pkg) return '<td width="50%"></td>';
      const downloads = pkg.downloads === "" ? "Downloads unavailable" : `${Number(pkg.downloads).toLocaleString("en-US")} downloads/month`;
      const repo = pkg.repository ? `<br /><a href="${escapeHtml(repoUrl(pkg.repository))}"><img src="https://img.shields.io/badge/Repository-View-D6AF36?style=for-the-badge&logo=github&labelColor=0B0B0D" alt="${escapeHtml(pkg.name)} repository" /></a>` : "";
      return `<td width="50%"><strong><a href="${escapeHtml(pkg.url)}">${escapeHtml(pkg.name)}</a></strong><br /><sub>v${escapeHtml(pkg.version)} | ${escapeHtml(downloads)}</sub><br /><sub>${escapeHtml(pkg.description)}</sub>${repo}</td>`;
    });
    rows.push(`  <tr>\n    ${cells.join("\n    ")}\n  </tr>`);
  }
  return `<table>\n${rows.join("\n")}\n</table>`;
}

const config = JSON.parse(await fs.readFile(configPath, "utf8"));
const names = config.packages || [];
const packages = [];
for (const name of names.slice(0, 8)) {
  try {
    packages.push(await getPackage(name));
  } catch (error) {
    console.warn(`${name}: ${error.message}`);
  }
}
const readme = await fs.readFile(readmePath, "utf8");
await fs.writeFile(readmePath, replaceBlock(readme, "NPM-PACKAGES", render(packages)));
