
// AUTHOR: 𝐑𝐉 𝐬𝐢𝐲𝐚𝐦

import { CONFIG } from "../config.js";
import { createLogger } from "../system/logger.js";

const logger = createLogger();

let pairingRequested = false;

export async function requestPairing(sock) {
  if (pairingRequested) return null;

  if (!CONFIG.PHONE_NUMBER) {
    logger.error("Phone number is missing in .env");
    return null;
  }

  if (!sock || typeof sock.requestPairingCode !== "function") {
    logger.error("Pairing is not available on this connection");
    return null;
  }

  try {
    pairingRequested = true;

    const code = await sock.requestPairingCode(
      CONFIG.PHONE_NUMBER
    );

    logger.success("WhatsApp Pairing Code:");
    logger.info(code);

    return code;

  } catch (error) {
    pairingRequested = false;

    logger.error("Pairing code request failed", error);

    return null;
  }
}
