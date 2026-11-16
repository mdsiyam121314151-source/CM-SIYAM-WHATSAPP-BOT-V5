import { CONFIG } from "../config.js";
import { COMMAND_CONFIG } from "../configCommands.js";

function normalizeNumber(value = "") {
  return String(value)
    .split("@")[0]
    .split(":")[0]
    .replace(/\D/g, "");
}

function includesNumber(list, number) {
  return list.some(
    item => normalizeNumber(item) === number
  );
}

export async function checkPermission(sock, message, command) {
  const jid = message.key.remoteJid;
  const sender = message.key.participant || jid;

  const senderNumber = normalizeNumber(sender);
  const ownerNumber = normalizeNumber(CONFIG.OWNER);

  const isOwner =
    Boolean(ownerNumber) && senderNumber === ownerNumber;

  const isBotAdmin = includesNumber(
    CONFIG.BOT_ADMINS,
    senderNumber
  );

  const isWhitelisted = includesNumber(
    CONFIG.WHITELIST,
    senderNumber
  );

  let isGroupAdmin = false;

  if (jid.endsWith("@g.us")) {
    try {
      const metadata = await sock.groupMetadata(jid);

      const participant = metadata.participants.find(
        item =>
          normalizeNumber(item.id) === senderNumber
      );

      isGroupAdmin =
        participant?.admin === "admin" ||
        participant?.admin === "superadmin";

    } catch {
      isGroupAdmin = false;
    }
  }

  let role = "USER";
  let rank = COMMAND_CONFIG.roles.USER;

  if (isGroupAdmin) {
    role = "GROUP_ADMIN";
    rank = COMMAND_CONFIG.roles.GROUP_ADMIN;
  }

  if (isBotAdmin) {
    role = "BOT_ADMIN";
    rank = COMMAND_CONFIG.roles.BOT_ADMIN;
  }

  if (isOwner) {
    role = "OWNER";
    rank = COMMAND_CONFIG.roles.OWNER;
  }

  const mode = CONFIG.MESSAGE_MODE;

  if (
    mode === COMMAND_CONFIG.modes.OWNER_ONLY &&
    !isOwner
  ) {
    return {
      allowed: false,
      role,
      reason: "শুধু Owner এই Bot ব্যবহার করতে পারবেন।"
    };
  }

  if (
    mode === COMMAND_CONFIG.modes.ADMIN_ONLY &&
    !isOwner &&
    !isBotAdmin &&
    !isGroupAdmin
  ) {
    return {
      allowed: false,
      role,
      reason: "শুধু Admin এই Mode-এ কমান্ড ব্যবহার করতে পারবেন।"
    };
  }

  if (
    mode === COMMAND_CONFIG.modes.WHITELIST &&
    !isOwner &&
    !isWhitelisted
  ) {
    return {
      allowed: false,
      role,
      reason: "আপনি Whitelist-এ নেই।"
    };
  }

  const requiredRole =
    COMMAND_CONFIG.roles[command.config.role || "USER"];

  if (
    typeof requiredRole === "number" &&
    rank < requiredRole
  ) {
    return {
      allowed: false,
      role,
      reason: "এই কমান্ড ব্যবহারের অনুমতি আপনার নেই।"
    };
  }

  return {
    allowed: true,
    role,
    isOwner,
    isBotAdmin,
    isGroupAdmin,
    isWhitelisted
  };
      }
