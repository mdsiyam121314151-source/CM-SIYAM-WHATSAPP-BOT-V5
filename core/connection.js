
// AUTHOR: 𝐑𝐉 𝐬𝐢𝐲𝐚𝐦

import fs from "fs-extra";
import pino from "pino";

import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} from "@whiskeysockets/baileys";

import { CONFIG } from "../config.js";
import { requestPairing } from "./pairing.js";
import { createLogger } from "../system/logger.js";

const logger = createLogger();

export async function connectToWhatsApp() {
  await fs.ensureDir(CONFIG.SESSION_DIR);

  const { state, saveCreds } =
    await useMultiFileAuthState(CONFIG.SESSION_DIR);

  let version;

  try {
    const result = await fetchLatestBaileysVersion();
    version = result.version;
  } catch (error) {
    logger.warn("Could not fetch latest WhatsApp version");
  }

  const sock = makeWASocket({
    ...(version ? { version } : {}),

    auth: state,

    logger: pino({ level: "silent" }),

    printQRInTerminal: false,

    browser: [
      CONFIG.BOT_NAME,
      "Chrome",
      CONFIG.VERSION
    ],

    markOnlineOnConnect: false,
    syncFullHistory: false
  });

  sock.ev.on("creds.update", saveCreds);

  if (!state.creds.registered && CONFIG.PHONE_NUMBER) {
    setTimeout(async () => {
      if (!state.creds.registered) {
        await requestPairing(sock);
      }
    }, 3000);
  }

  if (!CONFIG.PHONE_NUMBER && !state.creds.registered) {
    logger.warn(
      "BOT_PHONE_NUMBER is empty. Pairing cannot start."
    );
  }

  return sock;
}
