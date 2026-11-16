/**
 * CM SIYAM WhatsApp Bot V5
 * Author: 𝐂𝐌 𝐒𝐈𝐘𝐀𝐌
 */

import "dotenv/config";

export const CONFIG = Object.freeze({
  BOT_NAME: "CM SIYAM WhatsApp Bot",
  VERSION: "5.0.0",
  AUTHOR: "𝐂𝐌 𝐒𝐈𝐘𝐀𝐌",

  PREFIX: process.env.BOT_PREFIX || ".",

  PHONE_NUMBER: process.env.BOT_PHONE_NUMBER || "",

  OWNER: [
    process.env.OWNER_NUMBER || ""
  ],

  BOT_ADMINS: [],

  WHITELIST: [],

  SESSION_DIR: "./session",

  COMMAND_DIR: "./scripts/cmds",
  EVENT_DIR: "./scripts/events",

  LOG_LEVEL: process.env.LOG_LEVEL || "info",

  PAIRING_CODE: true,

  AUTO_RECONNECT: true,

  MAX_RECONNECT_DELAY: 30000,

  COMMAND_COOLDOWN: 1000,

  MESSAGE_MODE: "all",

  ALLOW_GROUP: true,
  ALLOW_INBOX: true,

  AUTHOR_VALIDATION: true
});

export default CONFIG;
