import { CONFIG, AUTHOR } from "./config.js";
import { connectToWhatsApp } from "./core/connection.js";
import { handleMessages } from "./core/messageHandler.js";
import { loadCommands } from "./core/commandHandler.js";

let reconnectTimer = null;
let reconnectDelay = CONFIG.RECONNECT_DELAY;
let isStarting = false;
let currentSocket = null;

const log = {
  info: (...args) => console.log("🟢 [RJ-SIYAM]", ...args),
  warn: (...args) => console.warn("🟡 [RJ-SIYAM]", ...args),
  error: (...args) => console.error("🔴 [RJ-SIYAM]", ...args)
};

async function startBot() {
  if (isStarting) return;

  isStarting = true;

  try {
    log.info(CONFIG.BOT_NAME);
    log.info(`Author: ${AUTHOR}`);

    await loadCommands();

    const sock = await connectToWhatsApp();
    currentSocket = sock;

    handleMessages(sock);

    sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
      if (connection === "open") {
        reconnectDelay = CONFIG.RECONNECT_DELAY;
        log.info("WhatsApp connected successfully");
      }

      if (connection === "close") {
        const statusCode =
          lastDisconnect?.error?.output?.statusCode;

        log.warn("Connection closed:", statusCode ?? "unknown");

        if (!reconnectTimer) {
          reconnectTimer = setTimeout(() => {
            reconnectTimer = null;
            startBot();
          }, reconnectDelay);

          reconnectDelay = Math.min(
            reconnectDelay * 2,
            CONFIG.MAX_RECONNECT_DELAY
          );
        }
      }
    });

  } catch (error) {
    log.error("Bot startup failed:", error);

    if (!reconnectTimer) {
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        startBot();
      }, reconnectDelay);
    }
  } finally {
    isStarting = false;
  }
}

process.on("uncaughtException", error => {
  log.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", error => {
  log.error("Unhandled Rejection:", error);
});

process.on("SIGINT", () => {
  log.warn("Bot shutting down");

  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
  }

  currentSocket?.end?.(new Error("Bot stopped"));

  process.exit(0);
});

startBot();
