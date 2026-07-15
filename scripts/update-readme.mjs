import fs from "node:fs/promises";

const root = new URL("../", import.meta.url);
const readmePath = new URL("README.md", root);

const stamp = new Date().toISOString().replace("T", " ").slice(0, 16) + " UTC";
const start = "<!-- LAST_UPDATED:START -->";
const end = "<!-- LAST_UPDATED:END -->";
const readme = await fs.readFile(readmePath, "utf8");
const next = readme.replace(
  new RegExp(`${start}[\\s\\S]*?${end}`),
  `${start}<sub>Last automated profile refresh: ${stamp}.</sub>${end}`
);
await fs.writeFile(readmePath, next);
