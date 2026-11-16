import { AUTHOR, CONFIG } from "../config.js";

export function handleError(error, source = "UNKNOWN") {
  const time = new Date().toLocaleString();

  console.error("╭━━━━━━━━━━━━━━━━━━━━━━━━━━╮");
  console.error("      RJ-SIYAM ERROR");
  console.error("╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯");

  console.error("Bot:", CONFIG.BOT_NAME);
  console.error("Author:", AUTHOR);
  console.error("Source:", source);
  console.error("Time:", time);
  console.error("Message:", error?.message || error);
  console.error("Stack:", error?.stack || "Not available");

  console.error("╭━━━━━━━━━━━━━━━━━━━━━━━━━━╮");
}

export function installErrorHandlers() {
  process.on("uncaughtException", error => {
    handleError(error, "UNCAUGHT_EXCEPTION");
  });

  process.on("unhandledRejection", error => {
    handleError(error, "UNHANDLED_REJECTION");
  });
}
