
 // AUTHOR: 𝐑𝐉 𝐬𝐢𝐲𝐚𝐦
// WARNING: লেখকের নাম পরিবর্তন করলে এই ফাইল Disable হবে।

import { AUTHOR } from "../../config.js";
import { getCommands } from "../../core/commandHandler.js";

const GIF_URLS = [
  "https://i.imgur.com/Xw6JTfn.gif",
  "https://i.imgur.com/mW0yjZb.gif",
  "https://i.imgur.com/KQBcxOV.gif"
];

const CATEGORY_EMOJIS = {
  system: "⚙️",
  economy: "💰",
  moderation: "🛡️",
  fun: "🎮",
  others: "📁"
};

const fancyFont = (str = "") => {
  const map = {
    A:"𝐀",B:"𝐁",C:"𝐂",D:"𝐃",E:"𝐄",F:"𝐅",G:"𝐆",H:"𝐇",
    I:"𝐈",J:"𝐉",K:"𝐊",L:"𝐋",M:"𝐌",N:"𝐍",O:"𝐎",P:"𝐏",
    Q:"𝐐",R:"𝐑",S:"𝐒",T:"𝐓",U:"𝐔",V:"𝐕",W:"𝐖",X:"𝐗",
    Y:"𝐘",Z:"𝐙",
    a:"𝐚",b:"𝐛",c:"𝐜",d:"𝐝",e:"𝐞",f:"𝐟",g:"𝐠",h:"𝐡",
    i:"𝐢",j:"𝐣",k:"𝐤",l:"𝐥",m:"𝐦",n:"𝐧",o:"𝐨",p:"𝐩",
    q:"𝐪",r:"𝐫",s:"𝐬",t:"𝐭",u:"𝐮",v:"𝐯",w:"𝐰",x:"𝐱",
    y:"𝐲",z:"𝐳"
  };

  return String(str).replace(/[A-Za-z]/g, c => map[c] || c);
};

const cleanCategory = value =>
  String(value || "others").toLowerCase();

export default {
  config: {
    name: "help",
    aliases: ["commands", "menu"],
    version: "6.3",
    author: "𝐑𝐉 𝐬𝐢𝐲𝐚𝐦",
    role: "USER",
    shortDescription: "Show all commands",
    longDescription:
      "সব Command, Category, Alias, Version, Author, Usage এবং নির্দিষ্ট Command-এর বিস্তারিত দেখায়।",
    category: "SYSTEM",
    usage: ".help [command name]"
  },

  onStart: async ({ reply, args = [], prefix = "." }) => {
    const allCommands = getCommands();

    if (!allCommands || allCommands.size === 0) {
      return reply("❌ কোনো Command পাওয়া যায়নি!");
    }

    const uniqueCommands = [
      ...new Map(
        [...allCommands.values()].map(cmd => [
          cmd.config.name,
          cmd
        ])
      ).values()
    ];

    // Single command details
    if (args[0]) {
      const cmdName = String(args[0]).toLowerCase().replace(/\.js$/i, "");

      const cmd =
        allCommands.get(cmdName) ||
        uniqueCommands.find(c =>
          c.config.aliases?.some(
            alias => alias.toLowerCase() === cmdName
          )
        );

      if (!cmd) {
        return reply(
          `❌ ${fancyFont(`Command '${cmdName}' not found!`)}\n` +
          `➤ Try ${prefix}help to see full list`
        );
      }

      const config = cmd.config;
      const usage = config.usage ||
        config.guide?.replace(/\{pn\}/g, `${prefix}${config.name}`) ||
        `${prefix}${config.name}`;

      const info =
`┏━━━━━━━━━━━━━━━━━━┓
       🧩 𝐂𝐌𝐃 𝐈𝐍𝐅𝐎
┗━━━━━━━━━━━━━━━━━━┛

✦ Name       : ${config.name}
✦ Aliases    : ${config.aliases?.join(", ") || "None"}
✦ Category   : ${fancyFont(config.category || "Others")}
✦ Version    : v${config.version || "1.0"}
✦ Author     : ${config.author || "Unknown"}
✦ Role       : ${config.role || "USER"}
✦ Usage      : ${usage}

━━━━━━━━━━━━━━━━━━
📝 Short Description:
${config.shortDescription || "No description"}

📖 Long Description:
${config.longDescription || "No description"}

━━━━━━━━━━━━━━━━━━
⚙️ Command Details Loaded
`;

      return reply(info);
    }

    // All commands grouped by category
    const categories = {};

    for (const cmd of uniqueCommands) {
      const category = cleanCategory(cmd.config.category);

      if (!categories[category]) {
        categories[category] = [];
      }

      categories[category].push(cmd.config.name);
    }

    let msg =
`┏━━━━━━━━━━━━━━━━━━┓
       📜 𝐂𝐌𝐃 𝐇𝐔𝐁
┗━━━━━━━━━━━━━━━━━━┛

🔧 Prefix : ${prefix}
📊 Total Commands : ${uniqueCommands.length}

━━━━━━━━━━━━━━━━━━
`;

    for (const category of Object.keys(categories).sort()) {
      const emoji = CATEGORY_EMOJIS[category] || "📁";

      msg +=
`\n${emoji} 『 ${fancyFont(category.toUpperCase())} 』 ✦ ${categories[category].length}\n`;

      msg += categories[category]
        .sort()
        .map(name => `    ➥ ${fancyFont(name)}`)
        .join("\n");

      msg += "\n";
    }

    msg +=
`\n━━━━━━━━━━━━━━━━━━
✨ Details: ${prefix}help <command>
📌 Example: ${prefix}help test
━━━━━━━━━━━━━━━━━━

✍️ Author : 𝐑𝐉 𝐬𝐢𝐲𝐚𝐦
`;

    // Random GIF link (WhatsApp-compatible text fallback)
    const randomGif =
      GIF_URLS[Math.floor(Math.random() * GIF_URLS.length)];

    msg += `\n🎞️ Menu GIF: ${randomGif}`;

    return reply(msg);
  }
};
      
