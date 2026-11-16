
// AUTHOR: 𝐑𝐉 𝐬𝐢𝐲𝐚𝐦

import { CONFIG } from "../config.js";

function timestamp() {
  return new Date().toLocaleString();
}

export function createLogger() {
  const output = (level, message, error = null) => {
    const line =
      `[${timestamp()}] [${level}] [${CONFIG.BOT_NAME}] ${message}`;

    if (level === "ERROR") {
      console.error(line);

      if (error) {
        console.error(error?.stack || error);
      }

      return;
    }

    if (level === "WARN") {
      console.warn(line);
      return;
    }

    console.log(line);
  };

  return {
    info: (message) => output("INFO", message),

    success: (message) => output("SUCCESS", message),

    warn: (message) => output("WARN", message),

    error: (message, error = null) =>
      output("ERROR", message, error),

    debug: (message) => {
      if (CONFIG.LOG_LEVEL === "debug") {
        output("DEBUG", message);
      }
    }
  };
}
