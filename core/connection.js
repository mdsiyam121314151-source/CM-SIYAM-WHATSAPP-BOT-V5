
// AUTHOR: 𝐑𝐉 𝐬𝐢𝐲𝐚𝐦
// WARNING: AUTHOR পরিবর্তন করলে এই ফাইল Disable হবে।

import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} from "@whiskeysockets/baileys";

import P from "pino";
import fs from "fs-extra";

import { CONFIG, AUTHOR } from "../config.js";
import { requestPairingCode } from "./pairing.js";

export const connectToWhatsApp = async () => {
  await fs.ensureDir(CONFIG.SESSION_DIR);

  const { state, saveCreds } = await useMultiFileAuthState(
    CONFIG.SESSION_DIR
  );

  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger: P({ level: "silent" }),
    browser: ["Ubuntu", "Chrome", "22.04.4"],
    printQRInTerminal: false,
    markOnlineOnConnect: true,
    syncFullHistory: false
  });

  sock.ev.on("creds.update", saveCreds);

  console.log(`
╭━━━━━━━━━━━━━━━━━━━━━━━━━━╮
       🤖 RJ SIYAM BOT
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📞 Bot Number: +${CONFIG.BOT_PHONE_NUMBER}
👑 Owner: ${CONFIG.OWNER_NUMBER}
⚙️ Prefix: ${CONFIG.PREFIX}
📦 Version: ${CONFIG.VERSION}
✍️ Author: ${AUTHOR}
`);

  if (!state.creds.registered) {
    try {
      await requestPairingCode(sock);
    } catch (error) {
      console.error("❌ Pairing request failed:", error.message);
    }
  }

  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "connecting") {
      console.log("🔄 WhatsApp সংযোগ হচ্ছে...");
    }

    if (connection === "open") {
      const connectedNumber =
        sock.user?.id?.split(":")[0] || CONFIG.BOT_PHONE_NUMBER;

      console.log(`
╭━━━━━━━━━━━━━━━━━━━━━━━━━━╮
       ✅ CONNECTION SUCCESS
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📱 WhatsApp Connected
📞 Number: +${connectedNumber}
🤖 Bot: ${CONFIG.BOT_NAME}
⚙️ Prefix: ${CONFIG.PREFIX}
👑 Owner: ${CONFIG.OWNER_NUMBER}

🎉 Bot Successfully Online!
`);
    }

    if (connection === "close") {
      const statusCode =
        lastDisconnect?.error?.output?.statusCode;

      console.log("❌ WhatsApp connection closed:", statusCode);

      if (statusCode === DisconnectReason.loggedOut) {
        console.log("⚠️ Session logged out. নতুন করে Pairing প্রয়োজন।");
      }
    }
  });

  return sock;
};
