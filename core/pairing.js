
// AUTHOR: 𝐑𝐉 𝐬𝐢𝐲𝐚𝐦
// WARNING: AUTHOR পরিবর্তন করলে এই ফাইল Disable হবে।

import { AUTHOR, CONFIG } from "../config.js";

let pairingRequested = false;

export const requestPairingCode = async (sock) => {
  if (!sock) {
    throw new Error("WhatsApp socket পাওয়া যায়নি।");
  }

  if (sock.authState?.creds?.registered) {
    console.log("✅ WhatsApp ইতিমধ্যে লিংক করা আছে।");
    return null;
  }

  if (pairingRequested) {
    console.log("⏳ Pairing Code request ইতিমধ্যে চলছে।");
    return null;
  }

  pairingRequested = true;

  const phone = CONFIG.PAIRING.PHONE_NUMBER;

  try {
    console.log(`
╭━━━━━━━━━━━━━━━━━━━━━━━━━━╮
       📱 WHATSAPP LINK
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📞 বটের নম্বর: +${phone}

📲 WhatsApp খুলুন
⚙️ Settings চাপুন
🔗 Linked Devices নির্বাচন করুন
📱 Link a Device চাপুন
🔢 Link with phone number instead নির্বাচন করুন

⏳ Pairing Code তৈরি হচ্ছে...
`);

    await new Promise(resolve => setTimeout(resolve, 3000));

    const code = await sock.requestPairingCode(phone);

    console.log(`
╭━━━━━━━━━━━━━━━━━━━━━━━━━━╮
       🔐 PAIRING CODE
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📞 Phone Number : +${phone}
🔑 Pairing Code : ${code}

📲 কোডটি WhatsApp-এ লিখুন।
⏳ কোডের মেয়াদ শেষ হওয়ার আগে ব্যবহার করুন।

✍️ Author : ${AUTHOR}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`);

    return code;
  } catch (error) {
    pairingRequested = false;

    console.error(`
❌ WhatsApp Pairing Failed
📞 Number: +${phone}
⚠️ Error: ${error.message}
`);

    throw error;
  }
};

export const resetPairingRequest = () => {
  pairingRequested = false;
};
