import fs from "node:fs/promises";

const root = new URL("../", import.meta.url);
const readmePath = new URL("README.md", root);
const configPath = new URL("config/linkedin.json", root);

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

function list(values = []) {
  return values.slice(0, 6).map((value) => `<code>${escapeHtml(value)}</code>`).join(" ");
}

function renderPosts(posts = []) {
  if (posts.length === 0) {
    return `<strong>Latest Posts</strong><br /><sub>Curated posts, launches, ideas, and engineering notes render here.</sub>`;
  }
  return posts.slice(0, 3).map((post) => {
    const date = post.date ? `<br /><sub>${escapeHtml(post.date)}</sub>` : "";
    return `<strong><a href="${escapeHtml(post.url || "#")}">${escapeHtml(post.title || "LinkedIn post")}</a></strong>${date}<br /><sub>${escapeHtml(post.summary || "")}</sub>`;
  }).join("<hr />");
}

function render(config) {
  const profileUrl = config.profileUrl || "xxxxxxxxx";
  const followers = config.followers ? `${config.followers} followers` : "Professional profile dashboard";
  return `<table>
  <tr>
    <td width="33%" align="center"><strong>${escapeHtml(config.name || "Sam Codex")}</strong><br /><sub>${escapeHtml(config.headline || "AI Automation Engineer")}</sub><br /><sub>${escapeHtml(followers)}</sub><br /><a href="${escapeHtml(profileUrl)}"><img src="https://img.shields.io/badge/LinkedIn-Connect-D6AF36?style=for-the-badge&logo=linkedin&labelColor=0B0B0D" alt="Connect on LinkedIn" /></a></td>
    <td width="33%">${renderPosts(config.posts)}</td>
    <td width="33%"><strong>Experience</strong><br />${list(config.experience)}<br /><br /><strong>Skills</strong><br />${list(config.skills)}</td>
  </tr>
</table>`;
}

const config = JSON.parse(await fs.readFile(configPath, "utf8"));
const readme = await fs.readFile(readmePath, "utf8");
await fs.writeFile(readmePath, replaceBlock(readme, "LINKEDIN-FEED", render(config)));
