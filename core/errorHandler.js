
// AUTHOR: 𝐑𝐉 𝐬𝐢𝐲𝐚𝐦

import { CONFIG } from "../config.js";

export function handleError(error, source = "Unknown") {
  const time = new Date().toISOString();

  console.error("\n========== BOT ERROR ==========");
  console.error("Bot:", CONFIG.BOT_NAME);
  console.error("Author:", CONFIG.AUTHOR);
  console.error("Source:", source);
  console.error("Time:", time);
  console.error("Error:", error?.stack || error);
  console.error("================================\n");
}

export function installErrorHandlers(logger) {
  process.on("uncaughtException", error => {
    handleError(error, "Uncaught Exception");
    logger?.error?.("Uncaught exception received");
  });

  process.on("unhandledRejection", reason => {
    handleError(reason, "Unhandled Rejection");
    logger?.error?.("Unhandled promise rejection");
  });
}
