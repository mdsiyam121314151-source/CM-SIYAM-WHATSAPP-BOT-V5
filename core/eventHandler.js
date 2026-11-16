
// AUTHOR: 𝐑𝐉 𝐬𝐢𝐲𝐚𝐦

import fs from "fs-extra";
import path from "path";
import { pathToFileURL } from "url";

import { CONFIG, AUTHOR } from "../config.js";
import { createLogger } from "../system/logger.js";

const logger = createLogger();

const events = new Map();

export async function loadEvents() {
  events.clear();

  await fs.ensureDir(CONFIG.EVENT_DIR);

  const files = await fs.readdir(CONFIG.EVENT_DIR);

  for (const file of files) {
    if (!file.endsWith(".js")) continue;

    const fullPath = path.join(CONFIG.EVENT_DIR, file);

    try {
      const source = await fs.readFile(fullPath, "utf8");

      if (CONFIG.AUTHOR_CHECK &&
          !source.includes(`AUTHOR: ${AUTHOR}`)) {
        logger.warn(`Event disabled: author mismatch: ${file}`);
        continue;
      }

      const module = await import(
        pathToFileURL(fullPath).href + `?v=${Date.now()}`
      );

      const event = module.default;

      if (!event?.config || typeof event.onStart !== "function") {
        logger.warn(`Invalid event disabled: ${file}`);
        continue;
      }

      if (event.config.author !== AUTHOR) {
        logger.warn(`Event disabled: wrong author: ${file}`);
        continue;
      }

      const eventName = event.config.event;

      if (!eventName) {
        logger.warn(`Event disabled: missing event name: ${file}`);
        continue;
      }

      if (!events.has(eventName)) {
        events.set(eventName, []);
      }

      events.get(eventName).push(event);

      logger.success(`Loaded event: ${event.config.name}`);

    } catch (error) {
      logger.error(`Failed to load event: ${file}`, error);
    }
  }

  return events;
}

export function attachEvents(sock) {
  for (const [eventName, handlers] of events.entries()) {
    sock.ev.on(eventName, async data => {
      for (const event of handlers) {
        try {
          await event.onStart({
            sock,
            data,
            eventName
          });
        } catch (error) {
          logger.error(
            `Event error: ${event.config.name}`,
            error
          );
        }
      }
    });
  }

  logger.success("Event listeners attached");
}

export function getEvents() {
  return events;
}
