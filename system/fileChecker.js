import fs from "fs-extra";
import path from "path";

import { AUTHOR, CONFIG } from "../config.js";

const ROOT = process.cwd();

const CHECK_DIRS = [
  CONFIG.COMMAND_DIR,
  CONFIG.EVENT_DIR
];

export async function checkFiles() {
  const results = {
    author: AUTHOR,
    checked: 0,
    valid: 0,
    invalid: [],
    errors: []
  };

  for (const directory of CHECK_DIRS) {
    await fs.ensureDir(directory);

    const files = await fs.readdir(directory);

    for (const file of files) {
      if (!file.endsWith(".js")) continue;

      const filePath = path.resolve(ROOT, directory, file);

      results.checked++;

      try {
        const source = await fs.readFile(filePath, "utf8");

        const hasAuthor =
          source.includes(`author: "${AUTHOR}"`) ||
          source.includes(`author: '${AUTHOR}'`);

        if (hasAuthor) {
          results.valid++;
        } else {
          results.invalid.push({
            file,
            directory,
            reason: "Author mismatch or missing author"
          });
        }

      } catch (error) {
        results.errors.push({
          file,
          reason: error.message
        });
      }
    }
  }

  return results;
}

export async function printFileReport() {
  const report = await checkFiles();

  console.log("╭━━━━━━━━━━━━━━━━━━━━━━━━━━╮");
  console.log("      RJ-SIYAM FILE CHECK");
  console.log("╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯");

  console.log("Author:", AUTHOR);
  console.log("Checked:", report.checked);
  console.log("Valid:", report.valid);
  console.log("Invalid:", report.invalid.length);

  for (const item of report.invalid) {
    console.error(
      `[RJ-SIYAM] INVALID: ${item.directory}/${item.file}`
    );
  }

  for (const item of report.errors) {
    console.error(
      `[RJ-SIYAM] ERROR: ${item.file}: ${item.reason}`
    );
  }

  return report;
}
