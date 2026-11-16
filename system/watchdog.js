import os from "os";

import { CONFIG, AUTHOR } from "../config.js";

let startedAt = Date.now();

export function getSystemStatus() {
  const memory = process.memoryUsage();

  return {
    botName: CONFIG.BOT_NAME,
    version: CONFIG.VERSION,
    author: AUTHOR,

    uptime: Math.floor(process.uptime()),

    memory: {
      rss: Math.round(memory.rss / 1024 / 1024),
      heapUsed: Math.round(memory.heapUsed / 1024 / 1024),
      heapTotal: Math.round(memory.heapTotal / 1024 / 1024)
    },

    system: {
      platform: os.platform(),
      architecture: os.arch(),
      freeMemory: Math.round(os.freemem() / 1024 / 1024),
      totalMemory: Math.round(os.totalmem() / 1024 / 1024)
    },

    startedAt
  };
}

export function resetWatchdog() {
  startedAt = Date.now();
}

export function printWatchdog() {
  const status = getSystemStatus();

  console.log("╭━━━━━━━━━━━━━━━━━━━━━━━━━━╮");
  console.log("       RJ-SIYAM WATCHDOG");
  console.log("╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯");

  console.log("Author:", status.author);
  console.log("Uptime:", status.uptime, "seconds");
  console.log("Memory:", status.memory.rss, "MB");
  console.log("Platform:", status.system.platform);

  return status;
}
