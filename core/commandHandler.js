
// AUTHOR: 𝐑𝐉 𝐬𝐢𝐲𝐚𝐦

import fs from "fs-extra";
import path from "path";
import { pathToFileURL } from "url";

import { CONFIG, AUTHOR } from "../config.js";
import { checkPermission } from "./permission.js";
import { COMMAND_CONFIG } from "../configCommands.js";
import { handleError } from "./errorHandler.js";
import { createLogger } from "../system/logger.js";

const logger = createLogger();

const commands = new Map();

function hasAuthorMarker(source) {
  return source.includes(`AUTHOR: ${AUTHOR}`);
}

export async function loadCommands() {
  commands.clear();

  await fs.ensureDir(CONFIG.COMMAND_DIR);

  const files = await fs.readdir(CONFIG.COMMAND_DIR);

  for (const file of files) {
    if (!file.endsWith(COMMAND_CONFIG.commandExtension)) continue;

    const fullPath = path.join(CONFIG.COMMAND_DIR, file);

    try {
      const source = await fs.readFile(fullPath, "utf8");

      if (CONFIG.AUTHOR_CHECK && !hasAuthorMarker(source)) {
        logger.warn(`Command disabled: author marker mismatch: ${file}`);
        continue;
      }

      const module = await import(
        pathToFileURL(fullPath).href + `?v=${Date.now()}`
      );

      const command = module.default;

      if (!command?.config || typeof command.onStart !== "function") {
        logger.warn(`Invalid command disabled: ${file}`);
        continue;
      }

      if (command.config.author !== AUTHOR) {
        logger.warn(`Command disabled: wrong author: ${file}`);
        continue;
      }

      const name = String(command.config.name || "").toLowerCase();

      if (!name) {
        logger.warn(`Command disabled: missing name: ${file}`);
        continue;
      }

      commands.set(name, command);

      for (const alias of command.config.aliases || []) {
        commands.set(String(alias).toLowerCase(), command);
      }

      logger.success(`Loaded command: ${name}`);

    } catch (error) {
      logger.error(`Failed to load command: ${file}`, error);
    }
  }

  return commands;
}

export async function handleCommand(context) {
  const { body, reply } = context;

  if (!body.startsWith(CONFIG.PREFIX)) return;

  const input = body.slice(CONFIG.PREFIX.length).trim();

  if (!input) return;

  const parts = input.split(/\s+/);
  const name = parts.shift().toLowerCase();
  const args = parts;

  const command = commands.get(name);

  if (!command) return;

  const permission = await checkPermission(
    context,
    command.config
  );

  if (!permission.allowed) {
    if (command.config.noPermissionMessage !== false) {
      await reply(
        command.config.permissionMessage ||
        "❌ এই কমান্ড ব্যবহারের অনুমতি তোমার নেই।"
      );
    }

    return;
  }

  try {
    await command.onStart({
      ...context,
      args,
      commandName: name,
      permission,
      config: command.config
    });

  } catch (error) {
    handleError(error, `Command: ${name}`);
    await reply("❌ কমান্ড চালাতে সমস্যা হয়েছে।");
  }
}

export function getCommands() {
  return commands;
}
