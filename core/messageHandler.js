import { getContentType } from "@whiskeysockets/baileys";

import { CONFIG } from "../config.js";
import { handleCommand } from "./commandHandler.js";

function getMessageBody(message) {
  let content = message.message;

  if (!content) return "";

  while (
    content.ephemeralMessage ||
    content.viewOnceMessage ||
    content.viewOnceMessageV2
  ) {
    content =
      content.ephemeralMessage?.message ||
      content.viewOnceMessage?.message ||
      content.viewOnceMessageV2?.message ||
      content;
  }

  const type = getContentType(content);

  if (!type) return "";

  const data = content[type];

  return (
    data?.text ||
    data?.caption ||
    content.conversation ||
    content.extendedTextMessage?.text ||
    ""
  ).trim();
}

export function handleMessages(sock) {
  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;

    for (const message of messages) {
      try {
        if (!message.message) continue;
        if (message.key.fromMe) continue;

        const jid = message.key.remoteJid;

        if (!jid || jid === "status@broadcast") continue;

        if (jid.endsWith("@g.us") && !CONFIG.ALLOW_GROUP) {
          continue;
        }

        if (!jid.endsWith("@g.us") && !CONFIG.ALLOW_INBOX) {
          continue;
        }

        const body = getMessageBody(message);

        if (!body) continue;

        await handleCommand(sock, message, body);

      } catch (error) {
        console.error("[RJ-SIYAM] Message error:", error);
      }
    }
  });
    }
