
// AUTHOR: 𝐑𝐉 𝐬𝐢𝐲𝐚𝐦
// WARNING: লেখকের নাম পরিবর্তন করলে এই ফাইল Disable হবে।

import { AUTHOR } from "../../config.js";

export default {
  config: {
    name: "test",
    aliases: ["check", "ping"],
    version: "1.0.0",
    author: "𝐑𝐉 𝐬𝐢𝐲𝐚𝐦",
    role: "USER",
    shortDescription: "Test WhatsApp bot",
    longDescription: "পরীক্ষা করে দেখবে WhatsApp Bot-এর Command System ঠিকমতো কাজ করছে কিনা।",
    category: "SYSTEM",
    usage: ".test"
  },

  onStart: async ({ reply, pushName, senderJid, isGroup }) => {
    await reply(
      `╭━━━━━━━━━━━━━━━━━━╮
       ༒ RJ SIYAM BOT ༒
╰━━━━━━━━━━━━━━━━━━╯

╭━━━〔 COMMAND TEST 〕━━━╮
│
│ ✅ Status : Working
│ 👤 Name : ${pushName}
│ 🆔 Sender : ${senderJid}
│ 📍 Type : ${isGroup ? "Group" : "Inbox"}
│ ⚙️ Prefix : .
│ 📦 Version : 5.0.0
│ ✍️ Author : 𝐑𝐉 𝐬𝐢𝐲𝐚𝐦
│
╰━━━━━━━━━━━━━━━━━━╯

🎉 Command System Successfully Working!`
    );
  }
};
