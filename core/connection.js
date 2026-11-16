import fs from "fs-extra";
import pino from "pino";

import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} from "@whiskeysockets/baileys";

import { CONFIG, AUTHOR } from "../config.js";
import { requestPairing } from "./pairing.js";

export async function connectToWhatsApp() {
  await fs.ensureDir(CONFIG.SESSION_DIR);

  const { state, saveCreds } =
    await useMultiFileAuthState(CONFIG.SESSION_DIR);

  let version;

  try {
    const result = await fetchLatestBaileysVersion();
    version = result.version;
  } catch (error) {
    console.warn("[RJ-SIYAM] Could not fetch WhatsApp version");
  }

  const sock = makeWASocket({
    auth: state,
    ...(version ? { version } : {}),
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    browser: [CONFIG.BOT_NAME, "Chrome", CONFIG.VERSION]
  });

  sock.ev.on("creds.update", saveCreds);

  if (!state.creds.registered) {
    setTimeout(async () => {
      try {
        await requestPairing(sock, CONFIG.PHONE_NUMBER);
      } catch (error) {
        console.error("[RJ-SIYAM] Pairing error:", error.message);
      }
    }, 3000);
  }

  console.log(`[RJ-SIYAM] Author: ${AUTHOR}`);

  return sock;
        }
