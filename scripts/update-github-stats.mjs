import fs from "node:fs/promises";

const root = new URL("../", import.meta.url);
const readmePath = new URL("README.md", root);

const owner = process.env.GITHUB_REPOSITORY_OWNER || process.env.PROFILE_USERNAME || "samcodex";
const token = process.env.GITHUB_TOKEN;

async function githubJson(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "sam-codex-profile-updater",
      ...(token ? { authorization: `Bearer ${token}` } : {})
    }
  });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.json();
}

function replaceBlock(readme, marker, content) {
  const start = `<!-- ${marker}:START -->`;
  const end = `<!-- ${marker}:END -->`;
  return readme.replace(new RegExp(`${start}[\\s\\S]*?${end}`), `${start}\n${content}\n${end}`);
}

function number(value) {
  return Number(value || 0).toLocaleString("en-US");
}

let user = { public_repos: 0, followers: 0 };
let repos = [];
try {
  user = await githubJson(`https://api.github.com/users/${owner}`);
  repos = await githubJson(`https://api.github.com/users/${owner}/repos?per_page=100&sort=updated`);
} catch (error) {
  console.warn(error.message);
}

const stars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
const updated = new Date().toISOString().replace("T", " ").slice(0, 16) + " UTC";

const section = `<table>
  <tr>
    <td width="25%" align="center"><strong>${number(user.public_repos)}</strong><br /><sub>Public Repositories</sub></td>
    <td width="25%" align="center"><strong>${number(user.followers)}</strong><br /><sub>Followers</sub></td>
    <td width="25%" align="center"><strong>${number(stars)}</strong><br /><sub>Total Stars</sub></td>
    <td width="25%" align="center"><strong>${updated}</strong><br /><sub>Last Sync</sub></td>
  </tr>
</table>`;

const readme = await fs.readFile(readmePath, "utf8");
await fs.writeFile(readmePath, replaceBlock(readme, "GITHUB-STATS-SUMMARY", section));
