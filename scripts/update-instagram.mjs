import fs from "node:fs/promises";

const root = new URL("../", import.meta.url);
const readmePath = new URL("README.md", root);
const configPath = new URL("config/instagram.json", root);

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function render(config) {
  const profileUrl = config.profileUrl || "xxxxxxxxx";
  const posts = (config.posts || []).slice(0, 6);
  const followerCount = config.followerCount || "Audience profile";

  if (posts.length === 0) {
    return `<table>
  <tr>
    <td width="33%" align="center"><strong>Latest Posts</strong><br /><sub>Six curated thumbnails keep the profile visual and current.</sub></td>
    <td width="33%" align="center"><strong>${escapeHtml(followerCount)}</strong><br /><sub>Instagram followers</sub></td>
    <td width="33%" align="center"><strong>Follow</strong><br /><a href="${escapeHtml(profileUrl)}"><img src="https://img.shields.io/badge/Instagram-Follow-D6AF36?style=for-the-badge&logo=instagram&labelColor=0B0B0D" alt="Follow Sam Codex on Instagram" /></a></td>
  </tr>
</table>`;
  }

  return `<table>
  <tr>
    <td colspan="3" align="center"><strong>${escapeHtml(followerCount)}</strong><br /><sub>Instagram followers</sub><br /><a href="${escapeHtml(profileUrl)}"><img src="https://img.shields.io/badge/Instagram-Follow-D6AF36?style=for-the-badge&logo=instagram&labelColor=0B0B0D" alt="Follow Sam Codex on Instagram" /></a></td>
  </tr>
  <tr>
    ${posts.slice(0, 3).map((post) => `<td width="33%" align="center"><a href="${escapeHtml(post.postUrl)}"><img src="${escapeHtml(post.thumbnailUrl)}" width="180" alt="${escapeHtml(post.title || "Instagram post")}" /></a><br /><sub>${escapeHtml(post.title || "Latest post")}</sub></td>`).join("\n    ")}
  </tr>
  <tr>
    ${posts.slice(3, 6).map((post) => `<td width="33%" align="center"><a href="${escapeHtml(post.postUrl)}"><img src="${escapeHtml(post.thumbnailUrl)}" width="180" alt="${escapeHtml(post.title || "Instagram post")}" /></a><br /><sub>${escapeHtml(post.title || "Latest post")}</sub></td>`).join("\n    ")}
  </tr>
</table>`;
}

function replaceBlock(readme, marker, content) {
  const start = `<!-- ${marker}:START -->`;
  const end = `<!-- ${marker}:END -->`;
  return readme.replace(new RegExp(`${start}[\\s\\S]*?${end}`), `${start}\n${content}\n${end}`);
}

const config = JSON.parse(await fs.readFile(configPath, "utf8"));
const readme = await fs.readFile(readmePath, "utf8");
await fs.writeFile(readmePath, replaceBlock(readme, "INSTAGRAM-FEED", render(config)));
