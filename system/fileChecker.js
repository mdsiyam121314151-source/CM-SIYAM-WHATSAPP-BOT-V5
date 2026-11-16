
// AUTHOR: 𝐑𝐉 𝐬𝐢𝐲𝐚𝐦

import fs from "fs-extra";
import path from "path";

import { CONFIG, AUTHOR } from "../config.js";

const SOURCE_DIRS = [
  "core",
  "database",
  "system",
  "scripts"
];

const ROOT_FILES = [
  "index.js",
  "config.js",
  "configCommands.js"
];

async function scanDirectory(directory, results = []) {
  if (!(await fs.pathExists(directory))) return results;

  const entries = await fs.readdir(directory, {
    withFileTypes: true
  });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (["node_modules", "session", "data"].includes(entry.name)) {
        continue;
      }

      await scanDirectory(fullPath, results);

    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      results.push(fullPath);
    }
  }

  return results;
}

export async function checkFiles() {
  const files = [];

  for (const dir of SOURCE_DIRS) {
    await scanDirectory(
      path.join(CONFIG.ROOT_DIR, dir),
      files
    );
  }

  for (const file of ROOT_FILES) {
    files.push(path.join(CONFIG.ROOT_DIR, file));
  }

  const results = [];

  for (const file of files) {
    try {
      const source = await fs.readFile(file, "utf8");

      results.push({
        file,
        valid: source.includes(`AUTHOR: ${AUTHOR}`),
        author: AUTHOR
      });

    } catch (error) {
      results.push({
        file,
        valid: false,
        error: error.message
      });
    }
  }

  return {
    total: results.length,
    valid: results.filter(item => item.valid).length,
    invalid: results.filter(item => !item.valid),
    results
  };
}
