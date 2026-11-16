import fs from "fs-extra";
import path from "path";
import { pathToFileURL } from "url";

import { CONFIG, AUTHOR } from "../config.js";

const events = new Map();

export async function loadEvents() {
  await fs.ensureDir(CONFIG.EVENT_DIR);
  events.clear();

  const files = await fs.readdir(CONFIG.EVENT_DIR);

  for (const file of files) {
    if (!file.endsWith(".js")) continue;

    const filePath = path.resolve(CONFIG.EVENT_DIR, file);

    try {
      const module = await import(
        `${pathToFileURL(filePath).href}?update=${Date.now()}`
      );

      const event = module.default;

      if (!event?.config || typeof event.onStart !== "function") {
        console.warn(`[RJ-SIYAM] Invalid event disabled: ${file}`);
        continue;
      }

      if (event.config.author !== AUTHOR) {
        console.error(`[RJ-SIYAM] Author mismatch: ${file}`);
        continue;
      }

      const name = event.config.name;

      if (!name) {
        console.warn(`[RJ-SIYAM] Event name missing: ${file}`);
        continue;
      }

      events.set(name, event);

      console.log(`[RJ-SIYAM] Event loaded: ${name}`);

    } catch (error) {
      console.error(`[RJ-SIYAM] Event load failed: ${file}`, error);
    }
  }

  console.log(`[RJ-SIYAM] Total events loaded: ${events.size}`);
}

export async function runEvent(name, context = {}) {
  const event = events.get(name);

  if (!event) return false;

  try {
    await event.onStart(context);
    return true;
  } catch (error) {
    console.error(`[RJ-SIYAM] Event error: ${name}`, error);
    return false;
  }
}

export function attachEvents(sock) {
  sock.ev.on("group-participants.update", async update => {
    await runEvent("groupParticipants", {
      sock,
      update
    });
  });

  sock.ev.on("messages.upsert", async data => {
    await runEvent("messagesUpsert", {
      sock,
      data
    });
  });

  sock.ev.on("connection.update", async data => {
    await runEvent("connectionUpdate", {
      sock,
      data
    });
  });
}
