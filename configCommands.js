import { AUTHOR } from "./config.js";

export const COMMAND_CONFIG = Object.freeze({
  author: AUTHOR,

  modes: {
    ALL: "all",
    ADMIN_ONLY: "adminOnly",
    WHITELIST: "whiteListMode",
    OWNER_ONLY: "ownerOnly"
  },

  roles: {
    USER: 0,
    GROUP_ADMIN: 1,
    BOT_ADMIN: 2,
    OWNER: 3
  },

  folders: {
    COMMANDS: "./scripts/cmds",
    EVENTS: "./scripts/events"
  },

  settings: {
    groupSupport: true,
    inboxSupport: true,
    authorCheck: true,
    commandAliases: true
  }
});
