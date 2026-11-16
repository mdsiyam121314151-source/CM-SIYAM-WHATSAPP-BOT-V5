
// AUTHOR: 𝐑𝐉 𝐬𝐢𝐲𝐚𝐦

import { CONFIG } from "../config.js";
import { COMMAND_CONFIG } from "../configCommands.js";
import { getGroup } from "../database/groups.js";

function digits(value = "") {
  return String(value).replace(/\D/g, "");
}

function isSameUser(a, b) {
  const first = digits(a);
  const second = digits(b);

  return first && second && first === second;
}

export async function checkPermission(context, commandConfig = {}) {
  const { sock, jid, senderJid, isGroup } = context;

  const owner = isSameUser(senderJid, CONFIG.OWNER);

  const botAdmin = CONFIG.BOT_ADMINS.some(number =>
    isSameUser(senderJid, number)
  );

  const whitelisted = CONFIG.WHITELIST.some(number =>
    isSameUser(senderJid, number)
  );

  let groupAdmin = false;

  if (isGroup) {
    try {
      const metadata = await sock.groupMetadata(jid);

      groupAdmin = metadata.participants.some(participant => {
        const same = participant.id === senderJid;

        return same &&
          ["admin", "superadmin"].includes(participant.admin);
      });

    } catch {
      groupAdmin = false;
    }
  }

  let role = "USER";

  if (owner) role = "OWNER";
  else if (botAdmin) role = "BOT_ADMIN";
  else if (groupAdmin) role = "GROUP_ADMIN";

  const roleValue = COMMAND_CONFIG.roles[role] ?? 0;

  const requiredRole =
    COMMAND_CONFIG.roles[commandConfig.role || "USER"];

  if (requiredRole === undefined) {
    return {
      allowed: false,
      role,
      reason: "Invalid command role"
    };
  }

  if (roleValue < requiredRole) {
    return {
      allowed: false,
      role,
      reason: "Insufficient role"
    };
  }

  let mode = CONFIG.MESSAGE_MODE;

  if (isGroup) {
    try {
      const group = await getGroup(jid);

      if (group?.mode) mode = group.mode;
    } catch {
      // Use global mode if group data is unavailable.
    }
  }

  if (owner) {
    return { allowed: true, role, reason: "Owner" };
  }

  if (mode === "ownerOnly") {
    return { allowed: false, role, reason: "Owner only mode" };
  }

  if (mode === "adminOnly" && !botAdmin && !groupAdmin) {
    return { allowed: false, role, reason: "Admin only mode" };
  }

  if (mode === "whiteListMode" && !whitelisted && !botAdmin) {
    return { allowed: false, role, reason: "Whitelist mode" };
  }

  return {
    allowed: true,
    role,
    reason: "Permission granted"
  };
}
