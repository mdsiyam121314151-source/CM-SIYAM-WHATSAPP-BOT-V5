
import "dotenv/config";

// লেখকের নাম
export const AUTHOR = "𝐑𝐉 𝐬𝐢𝐲𝐚𝐦";

const list = (value = "") =>
  value.split(",").map(v => v.trim()).filter(Boolean);

export const CONFIG = Object.freeze({
  // বটের নাম
  BOT_NAME: "RJ-siyam whatsapp-botV5",

  // বটের ভার্সন
  VERSION: "5.0",

  // লেখকের নাম
  AUTHOR,

  // বটের কমান্ড Prefix
  PREFIX: process.env.BOT_PREFIX || ".",

  // এখানে তোমার বটের WhatsApp নাম্বার বসাবে
  PHONE_NUMBER: (process.env.BOT_PHONE_NUMBER || "").replace(/\D/g, ""),

  // এখানে বটের মালিক অর্থাৎ তোমার নিজের WhatsApp নাম্বার বসাবে
  OWNER: (process.env.OWNER_NUMBER || "").replace(/\D/g, ""),

  // এখানে বটের অন্যান্য অ্যাডমিনদের WhatsApp নাম্বার বসাবে
  BOT_ADMINS: list(process.env.BOT_ADMINS),

  // এখানে যাদের বট ব্যবহারের বিশেষ অনুমতি দিতে চাও তাদের নাম্বার বসাবে
  WHITELIST: list(process.env.WHITELIST),


  SESSION_DIR: "./session",


  COMMAND_DIR: "./scripts/cmds",


  EVENT_DIR: "./scripts/events",

  LOG_LEVEL: process.env.LOG_LEVEL || "info",

  MESSAGE_MODE: process.env.MESSAGE_MODE || "all",

  ALLOW_GROUP: true,

  ALLOW_INBOX: true,

  AUTHOR_CHECK: true,

  COOLDOWN: 1000,

  RECONNECT_DELAY: 5000,

  MAX_RECONNECT_DELAY: 60000
});
