import fs from "fs-extra";
import path from "path";
import { pathToFileURL } from "url";

import { CONFIG, AUTHOR } from "../config.js";
import { checkPermission } from "./permission.js";

const commands = new Map();
const aliases = new Map();

export async function loadCommands() {
  await fs.ensureDir(CONFIG.COMMAND_DIR);

  commands.clear();
  aliases.clear();

  const files = await fs.readdir(CONFIG.COMMAND_DIR);

  for (const file of files) {
    if (!file.endsWith(".js")) continue;

    const filePath = path.resolve(CONFIG.COMMAND_DIR, file);

    try {
      const module = await import(
        `${pathToFileURL(filePath).href}?update=${Date.now()}`
      );

      const command = module.default;

      if (
        !command?.config ||
        typeof command.onStart !== "function"
      ) {
        console.warn(`[RJ-SIYAM] Disabled invalid command: ${file}`);
        continue;
      }

      if (
        CONFIG.AUTHOR_CHECK &&
        command.config.author !== AUTHOR
      ) {
        console.error(`[RJ-SIYAM] Author mismatch: ${file}`);
        continue;
      }

      const name = String(
        command.config.name || ""
      ).toLowerCase();

      if (!name) {
        console.warn(`[RJ-SIYAM] Command name missing: ${file}`);
        continue;
      }

      if (commands.has(name)) {
        console.warn(`[RJ-SIYAM] Duplicate command: ${name}`);
        continue;
      }

      commands.set(name, command);

      for (const alias of command.config.aliases || []) {
        aliases.set(String(alias).toLowerCase(), name);
      }

      console.log(`[RJ-SIYAM] Loaded command: ${name}`);

    } catch (error) {
      console.error(`[RJ-SIYAM] Failed to load ${file}:`, error);
    }
  }

  console.log(`[RJ-SIYAM] Total commands: ${commands.size}`);
}

export async function handleCommand(sock, message, body) {
  if (!body.startsWith(CONFIG.PREFIX)) return;

  const parts = body
    .slice(CONFIG.PREFIX.length)
    .trim()
    .split(/\s+/);

  const input = (parts.shift() || "").toLowerCase();

  if (!input) return;

  const commandName = aliases.get(input) || input;
  const command = commands.get(commandName);

  if (!command) return;

  const permission = await checkPermission(
    sock,
    message,
    command
  );

  const jid = message.key.remoteJid;

  const reply = text =>
    sock.sendMessage(
      jid,
      { text: String(text) },
      { quoted: message }
    );

  if (!permission.allowed) {
    return reply(`❌ ${permission.reason}`);
  }

  try {
    await command.onStart({
      sock,
      message,
      args: parts,
      command,
      permission,
      config: CONFIG,
      reply
    });
  } catch (error) {
    console.error(`[RJ-SIYAM] Command error: ${commandName}`, error);

    await reply("❌ Command চালাতে সমস্যা হয়েছে।");
  }
}
