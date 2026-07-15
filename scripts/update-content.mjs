import fs from "node:fs/promises";

const root = new URL("../", import.meta.url);
const readmePath = new URL("README.md", root);
const configPath = new URL("config/content-sources.json", root);
const youtubeConfigPath = new URL("config/youtube.json", root);

const goldButton = "D6AF36?style=for-the-badge&labelColor=0B0B0D";

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

async function fetchText(url) {
  if (!url) return "";
  const response = await fetch(url, { headers: { "user-agent": "sam-codex-profile-updater" } });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.text();
}

function textBetween(block, tag) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? decodeXml(stripTags(match[1])) : "";
}

function parseFeed(xml, source, limit = 3) {
  const blocks = [...xml.matchAll(/<(item|entry)[^>]*>([\s\S]*?)<\/\1>/gi)].map((m) => m[2]);
  return blocks.slice(0, limit).map((block) => {
    const linkMatch = block.match(/<link[^>]*href="([^"]+)"/i);
    return {
      source,
      title: textBetween(block, "title") || "Untitled",
      url: textBetween(block, "link") || (linkMatch ? decodeXml(linkMatch[1]) : ""),
      date: textBetween(block, "pubDate") || textBetween(block, "published") || textBetween(block, "updated"),
      description: textBetween(block, "description") || textBetween(block, "summary") || ""
    };
  });
}

async function safe(label, fn) {
  try {
    return await fn();
  } catch (error) {
    console.warn(`${label}: ${error.message}`);
    return [];
  }
}

async function getArticles(config) {
  const feeds = [];
  if (config.devto?.username) feeds.push(["DEV.to", `https://dev.to/feed/${config.devto.username}`]);
  if (config.hashnode?.feedUrl) feeds.push(["Hashnode", config.hashnode.feedUrl]);
  if (config.medium?.username) feeds.push(["Medium", `https://medium.com/feed/@${config.medium.username}`]);
  for (const feedUrl of config.blog?.feeds || []) feeds.push(["Blog", feedUrl]);

  const groups = await Promise.all(
    feeds.map(([label, url]) => safe(label, async () => parseFeed(await fetchText(url), label, 3)))
  );
  return groups.flat();
}

async function getReleases(config) {
  const owner = config.github?.owner;
  const repos = config.github?.repositories || [];
  if (!owner || repos.length === 0) return [];
  const groups = await Promise.all(
    repos.map((repo) =>
      safe(`GitHub ${repo}`, async () => {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`, {
          headers: { "user-agent": "sam-codex-profile-updater" }
        });
        if (!response.ok) return [];
        const release = await response.json();
        return [{
          source: "GitHub Release",
          title: `${repo}: ${release.name || release.tag_name}`,
          url: release.html_url,
          date: release.published_at || release.created_at,
          description: stripTags(release.body || "")
        }];
      })
    )
  );
  return groups.flat();
}

async function getNpmPackages(config) {
  const packages = config.npm?.packages || [];
  const groups = await Promise.all(
    packages.map((name) =>
      safe(`npm ${name}`, async () => {
        const response = await fetch(`https://registry.npmjs.org/${encodeURIComponent(name)}/latest`);
        if (!response.ok) return [];
        const pkg = await response.json();
        return [{
          source: "npm",
          title: `${pkg.name}@${pkg.version}`,
          url: `https://www.npmjs.com/package/${pkg.name}`,
          date: "",
          description: pkg.description || ""
        }];
      })
    )
  );
  return groups.flat();
}

async function getYouTubeVideos() {
  let config;
  try {
    config = JSON.parse(await fs.readFile(youtubeConfigPath, "utf8"));
  } catch {
    return [];
  }
  if (!config.channelId) return [];
  return safe("YouTube", async () => {
    const xml = await fetchText(`https://www.youtube.com/feeds/videos.xml?channel_id=${config.channelId}`);
    const blocks = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/gi)].map((m) => m[1]).slice(0, 3);
    return blocks.map((block) => {
      const videoId = textBetween(block, "yt:videoId");
      return {
        source: "YouTube",
        title: textBetween(block, "title") || "Untitled video",
        url: `https://www.youtube.com/watch?v=${videoId}`,
        date: textBetween(block, "published"),
        description: "Latest video from the Sam Codex YouTube channel."
      };
    });
  });
}

function card(item) {
  const date = item.date ? `<br /><sub>${escapeHtml(new Date(item.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }))}</sub>` : "";
  const description = item.description ? `<br /><sub>${escapeHtml(item.description).slice(0, 150)}</sub>` : "";
  const link = item.url || "#";
  return `<td width="50%"><strong>${escapeHtml(item.source)}</strong><br /><a href="${escapeHtml(link)}">${escapeHtml(item.title)}</a>${date}${description}</td>`;
}

function renderSection(items) {
  if (items.length === 0) {
    return `<table>
  <tr>
    <td width="50%"><strong>Content Engine</strong><br /><sub>Daily and six-hour workflows publish videos, articles, releases, packages, and blog updates into this dashboard.</sub></td>
    <td width="50%"><strong>Premium Feed Layout</strong><br /><sub>Cards are generated from RSS, GitHub, npm, and curated social configuration.</sub></td>
  </tr>
</table>`;
  }

  const rows = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(`  <tr>
    ${card(items[i])}
    ${items[i + 1] ? card(items[i + 1]) : '<td width="50%"></td>'}
  </tr>`);
  }
  return `<table>\n${rows.join("\n")}\n</table>`;
}

function replaceBlock(readme, marker, content) {
  const start = `<!-- ${marker}:START -->`;
  const end = `<!-- ${marker}:END -->`;
  const pattern = new RegExp(`${start}[\\s\\S]*?${end}`);
  return readme.replace(pattern, `${start}\n${content}\n${end}`);
}

const config = JSON.parse(await fs.readFile(configPath, "utf8"));
const items = [
  ...(await getYouTubeVideos()),
  ...(await getArticles(config)),
  ...(await getReleases(config)),
  ...(await getNpmPackages(config))
].slice(0, 10);

const readme = await fs.readFile(readmePath, "utf8");
await fs.writeFile(readmePath, replaceBlock(readme, "CONTENT-DASHBOARD", renderSection(items)));
