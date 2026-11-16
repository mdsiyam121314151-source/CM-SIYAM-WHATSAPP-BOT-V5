import { CONFIG, AUTHOR } from "../config.js";

export async function requestPairing(sock, phoneNumber) {
  if (!phoneNumber) {
    throw new Error(
      "BOT_PHONE_NUMBER is missing in .env"
    );
  }

  const number = String(phoneNumber).replace(/\D/g, "");

  if (!/^\d{10,15}$/.test(number)) {
    throw new Error("Invalid phone number format");
  }

  if (
    !sock ||
    typeof sock.requestPairingCode !== "function"
  ) {
    throw new Error("WhatsApp socket is not ready");
  }

  const code = await sock.requestPairingCode(number);

  console.log("╭━━━━━━━━━━━━━━━━━━━━╮");
  console.log("      RJ-SIYAM BOT");
  console.log("╰━━━━━━━━━━━━━━━━━━━━╯");
  console.log(`Author: ${AUTHOR}`);
  console.log(`Pairing Code: ${code}`);
  console.log("╭━━━━━━━━━━━━━━━━━━━━╮");

  return code;
}
