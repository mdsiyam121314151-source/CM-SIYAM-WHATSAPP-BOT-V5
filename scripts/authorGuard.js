
// AUTHOR: 𝐑𝐉 𝐬𝐢𝐲𝐚𝐦

import { AUTHOR } from "../config.js";
import { checkFiles } from "../system/fileChecker.js";

import { createLogger } from "../system/logger.js";

const logger = createLogger();

export async function validateAuthor() {
  const report = await checkFiles();

  logger.info(
    `Author check: ${report.valid}/${report.total} valid`
  );

  if (report.invalid.length) {
    for (const item of report.invalid) {
      logger.warn(
        `Author mismatch: ${item.file}`
      );
    }
  } else {
    logger.success("All scanned source files passed author check");
  }

  return report;
}

export default {
  config: {
    name: "authorcheck",
    aliases: ["checkauthor"],
    version: "1.0",
    author: AUTHOR,
    role: "OWNER",
    description: "Check project author integrity"
  },

  onStart: async ({ reply }) => {
    const report = await validateAuthor();

    let output =
      `╭━━━〔 AUTHOR CHECK 〕━━━╮\n` +
      `│ Author: ${AUTHOR}\n` +
      `│ Total: ${report.total}\n` +
      `│ Valid: ${report.valid}\n` +
      `│ Invalid: ${report.invalid.length}\n` +
      `╰━━━━━━━━━━━━━━━━━━╯`;

    if (report.invalid.length) {
      output += "\n\nInvalid files:\n";

      output += report.invalid
        .map(item => `• ${item.file}`)
        .join("\n");
    }

    await reply(output);
  }
};
