
import "dotenv/config";

// AUTHOR: 𝐑𝐉 𝐬𝐢𝐲𝐚𝐦
// WARNING: AUTHOR পরিবর্তন করলে এই ফাইল Disable হবে।

export const AUTHOR = "𝐑𝐉 𝐬𝐢𝐲𝐚𝐦";

const list = (value = "") =>
  value.split(",").map(v => v.trim()).filter(Boolean);

const normalizeNumber = (number = "") => {
  let value = String(number).replace(/\D/g, "");

  if (value.startsWith("0")) {
    value = "88" + value;
  }

  return value;
};

const BOT_NUMBER = normalizeNumber(
  process.env.BOT_PHONE_NUMBER || "01608279461"
);

const OWNER_NUMBER = normalizeNumber(
  process.env.OWNER_NUMBER || "01789138157"
);

export const CONFIG = Object.freeze({
  BOT_NAME: "RJ-siyam whatsapp-botV5",
  AUTHOR,

  VERSION: "5.0.0",
  PREFIX: "/",

  BOT_PHONE_NUMBER: BOT_NUMBER,
  OWNER_NUMBER,

  OWNER_ID: `${OWNER_NUMBER}@s.whatsapp.net`,

  BOT_ADMIN_IDS: [
    `${OWNER_NUMBER}@s.whatsapp.net`
  ],

  WHITELIST_IDS: list(
    process.env.WHITELIST_IDS
  ),

  SESSION_DIR: "./session",
  COMMAND_DIR: "./scripts/cmds",
  EVENT_DIR: "./scripts/events",

  DEFAULT_MODE: "all",

  MODES: Object.freeze([
    "all",
    "adminOnly",
    "whiteListMode",
    "ownerOnly"
  ]),

  PAIRING: Object.freeze({
    ENABLED: true,
    PHONE_NUMBER: BOT_NUMBER,
    CODE_LENGTH: 8,
    SHOW_PHONE_NUMBER: true
  }),

  DATABASE: Object.freeze({
    DIRECTORY: "./database",
    USERS_FILE: "./database/users.json",
    GROUPS_FILE: "./database/groups.json"
  }),

  LOGGING: Object.freeze({
    SHOW_PAIRING_CODE: true,
    SHOW_CONNECTION_STATUS: true,
    SHOW_PHONE_NUMBER: true
  })
});

export const isOwner = (jid = "") => {
  const number = String(jid).split("@")[0].split(":")[0];
  return normalizeNumber(number) === OWNER_NUMBER;
};

export const isBotAdmin = (jid = "") => {
  const number = String(jid).split("@")[0].split(":")[0];

  return (
    normalizeNumber(number) === OWNER_NUMBER ||
    CONFIG.BOT_ADMIN_IDS.includes(jid)
  );
};

export const getPhoneNumber = () => BOT_NUMBER;
