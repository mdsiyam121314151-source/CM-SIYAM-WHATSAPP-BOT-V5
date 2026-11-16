
// AUTHOR: 𝐑𝐉 𝐬𝐢𝐲𝐚𝐦

import os from "os";

import { CONFIG } from "../config.js";

const startedAt = Date.now();

export function getSystemStatus() {
  const memory = process.memoryUsage();

  return {
    botName: CONFIG.BOT_NAME,
    author: CONFIG.AUTHOR,
    uptime: Math.floor((Date.now() - startedAt) / 1000),
    platform: os.platform(),
    nodeVersion: process.version,
    memory: {
      rss: memory.rss,
      heapUsed: memory.heapUsed,
      heapTotal: memory.heapTotal
    }
  };
}

export function printWatchdog() {
  const status = getSystemStatus();

  console.log("\n========== BOT STATUS ==========");
  console.log("Bot:", status.botName);
  console.log("Author:", status.author);
  console.log("Uptime:", status.uptime, "seconds");
  console.log("Platform:", status.platform);
  console.log("Node:", status.nodeVersion);
  console.log("Memory:", status.memory.heapUsed);
  console.log("================================\n");

  return status;
}

export function resetWatchdog() {
  return Date.now();
}
