import fs from "node:fs/promises";

const root = new URL("../", import.meta.url);
const readmePath = new URL("README.md", root);
const configPath = new URL("config/blog.json", root);

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function stripTags(value = "") {
  return value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function decodeXml(value = "") {
  return value
    .replaceAll("<![CDATA[", "")
    .replaceAll("]]>", "")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

function textBetween(block, tag) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? decodeXml(stripTags(match[1])) : "";
}

async function fetchText(url) {
  const response = await fetch(url, { headers: { "user-agent": "sam-codex-profile-updater" } });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.text();
}

function parseFeed(xml, source, limit) {
  const blocks = [...xml.matchAll(/<(item|entry)[^>]*>([\s\S]*?)<\/\1>/gi)].map((m) => m[2]);
  return blocks.slice(0, limit).map((block) => {
    const linkMatch = block.match(/<link[^>]*href="([^"]+)"/i);
    return {
      source,
      title: textBetween(block, "title") || "Untitled",
      url: textBetween(block, "link") || (linkMatch ? decodeXml(linkMatch[1]) : ""),
      date: textBetween(block, "pubDate") || textBetween(block, "published") || textBetween(block, "updated"),
      summary: textBetween(block, "description") || textBetween(block, "summary") || ""
    };
  });
}

function replaceBlock(readme, marker, content) {
  const start = `<!-- ${marker}:START -->`;
  const end = `<!-- ${marker}:END -->`;
  return readme.replace(new RegExp(`${start}[\\s\\S]*?${end}`), `${start}\n${content}\n${end}`);
}

function render(articles) {
  if (articles.length === 0) {
    return `<table>
  <tr>
    <td width="33%"><strong>DEV.to</strong><br /><sub>Latest engineering articles sync from RSS every day.</sub></td>
    <td width="33%"><strong>Hashnode</strong><br /><sub>Long-form build notes and product thinking render as article cards.</sub></td>
    <td width="33%"><strong>Medium</strong><br /><sub>Published essays and technical posts join the same dashboard feed.</sub></td>
  </tr>
</table>`;
  }
  return `<table>
${articles.map((article) => `  <tr>
    <td width="22%"><strong>${escapeHtml(article.source)}</strong><br /><sub>${article.date ? escapeHtml(new Date(article.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })) : "Latest article"}</sub></td>
    <td width="78%"><strong><a href="${escapeHtml(article.url)}">${escapeHtml(article.title)}</a></strong><br /><sub>${escapeHtml(article.summary).slice(0, 180)}</sub></td>
  </tr>`).join("\n")}
</table>`;
}

const config = JSON.parse(await fs.readFile(configPath, "utf8"));
const max = config.maxArticles || 5;
const feeds = [];
if (config.devto?.feedUrl) feeds.push(["DEV.to", config.devto.feedUrl]);
else if (config.devto?.username) feeds.push(["DEV.to", `https://dev.to/feed/${config.devto.username}`]);
if (config.hashnode?.feedUrl) feeds.push(["Hashnode", config.hashnode.feedUrl]);
if (config.medium?.feedUrl) feeds.push(["Medium", config.medium.feedUrl]);
else if (config.medium?.username) feeds.push(["Medium", `https://medium.com/feed/@${config.medium.username}`]);
for (const feedUrl of config.customFeeds || []) feeds.push(["Blog", feedUrl]);

const articles = [];
for (const [source, url] of feeds) {
  try {
    articles.push(...parseFeed(await fetchText(url), source, max));
  } catch (error) {
    console.warn(`${source}: ${error.message}`);
  }
}
articles.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
const readme = await fs.readFile(readmePath, "utf8");
await fs.writeFile(readmePath, replaceBlock(readme, "BLOG-FEED", render(articles.slice(0, max))));
