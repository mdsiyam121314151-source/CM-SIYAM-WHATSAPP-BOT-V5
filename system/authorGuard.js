import { AUTHOR } from "../config.js";
import { checkFiles } from "../system/fileChecker.js";

export async function validateAuthor() {
  const report = await checkFiles();

  if (report.invalid.length > 0 || report.errors.length > 0) {
    console.error("╭━━━━━━━━━━━━━━━━━━━━━━━━━━╮");
    console.error("      RJ-SIYAM AUTHOR GUARD");
    console.error("╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯");

    console.error("Expected Author:", AUTHOR);

    for (const item of report.invalid) {
      console.error(
        `Author mismatch: ${item.directory}/${item.file}`
      );
    }

    return {
      valid: false,
      report
    };
  }

  console.log("[RJ-SIYAM] All command/event authors are valid.");

  return {
    valid: true,
    report
  };
}

export default {
  config: {
    name: "authorGuard",
    author: AUTHOR
  },
  validateAuthor
};
