
// AUTHOR: 𝐑𝐉 𝐬𝐢𝐲𝐚𝐦

import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

export const AUTHOR = "𝐑𝐉 𝐬𝐢𝐲𝐚𝐦";

const ROOT_DIR = path.dirname(fileURLToPath(import.meta.url));

const list = (value = "") =>
  value.split(",")
    .map(v => v.trim().replace(/\D/g, ""))
    .filter(Boolean);

export const CONFIG = Object.freeze({
  BOT_NAME: "RJ-siyam whatsapp-botV5",
  VERSION: "5.0.0",
  AUTHOR,

  ROOT_DIR,

  PREFIX: process.env.BOT_PREFIX || ".",

  PHONE_NUMBER: (process.env.BOT_PHONE_NUMBER || "").replace(/\D/g, ""),
  OWNER: (process.env.OWNER_NUMBER || "").replace(/\D/g, ""),

  BOT_ADMINS: list(process.env.BOT_ADMINS),
  WHITELIST: list(process.env.WHITELIST),

  SESSION_DIR: path.join(ROOT_DIR, "session"),
  COMMAND_DIR: path.join(ROOT_DIR, "scripts", "cmds"),
  EVENT_DIR: path.join(ROOT_DIR, "scripts", "events"),
  DATABASE_DIR: path.join(ROOT_DIR, "database", "data"),

  LOG_LEVEL: process.env.LOG_LEVEL || "info",

  MESSAGE_MODE: process.env.MESSAGE_MODE || "all",

  ALLOW_GROUP: true,
  ALLOW_INBOX: true,

  AUTHOR_CHECK: true,

  COOLDOWN: 1000,

  RECONNECT_DELAY: 5000,
  MAX_RECONNECT_DELAY: 60000
});
