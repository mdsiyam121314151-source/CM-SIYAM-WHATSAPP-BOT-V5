import { AUTHOR, CONFIG } from "../config.js";

const COLORS = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m"
};

function format(level, color, ...args) {
  const time = new Date().toLocaleTimeString();

  console.log(
    `${COLORS.gray}[${time}]${COLORS.reset}`,
    `${color}[RJ-SIYAM ${level}]${COLORS.reset}`,
    ...args
  );
}

export function createLogger() {
  return {
    info: (...args) =>
      format("INFO", COLORS.cyan, ...args),

    success: (...args) =>
      format("SUCCESS", COLORS.green, ...args),

    warn: (...args) =>
      format("WARN", COLORS.yellow, ...args),

    error: (...args) =>
      format("ERROR", COLORS.red, ...args),

    debug: (...args) => {
      if (CONFIG.LOG_LEVEL === "debug") {
        format("DEBUG", COLORS.blue, ...args);
      }
    },

    author: AUTHOR
  };
}
