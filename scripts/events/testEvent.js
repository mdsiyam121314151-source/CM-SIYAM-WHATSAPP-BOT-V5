
// AUTHOR: 𝐑𝐉 𝐬𝐢𝐲𝐚𝐦
// WARNING: লেখকের নাম পরিবর্তন করলে এই ফাইল Disable হবে।

import { AUTHOR } from "../../config.js";

export default {
  config: {
    name: "testEvent",
    event: "messages.upsert",
    version: "1.0.0",
    author: "𝐑𝐉 𝐬𝐢𝐲𝐚𝐦",
    description: "Test WhatsApp message event system"
  },

  onStart: async (eventData = {}) => {
    const payload = Array.isArray(eventData)
      ? eventData[0]
      : eventData;

    const messages = payload?.messages || [];

    if (!messages.length) return;

    for (const message of messages) {
      if (!message?.message) continue;
      if (message.key?.fromMe) continue;
      if (message.key?.remoteJid === "status@broadcast") continue;

      console.log(`
╭━━━━━━━━━━━━━━━━━━━━╮
       EVENT TEST
╰━━━━━━━━━━━━━━━━━━━━╯

✅ Event Status : Working
📩 Event : messages.upsert
🆔 Message ID : ${message.key?.id || "Unknown"}
👤 Sender : ${message.key?.participant || message.key?.remoteJid || "Unknown"}
📍 Chat : ${message.key?.remoteJid || "Unknown"}
✍️ Author : 𝐑𝐉 𝐬𝐢𝐲𝐚𝐦

╰━━━━━━━━━━━━━━━━━━━━╯
`);
    }
  }
};
