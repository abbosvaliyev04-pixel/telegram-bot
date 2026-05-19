import TelegramBot from "node-telegram-bot-api";
import { logger } from "../lib/logger";
import { numberList } from "./numbering";
import { checkGrammar } from "./grammar";

type BotMode = "numbering" | "grammar" | null;

const userModes = new Map<number, BotMode>();

const HELP_TEXT = `👋 Hello! I can help you with two things:

/number — Send me a list of items and I'll number them 1 to N
/grammar — Send me any text and I'll fix the grammar and spelling (English, German, Russian, Uzbek, and more)
/help — Show this message`;

export function startBot(token: string): void {
  const bot = new TelegramBot(token, { polling: true });

  logger.info("Telegram bot started");

  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    userModes.delete(chatId);
    await bot.sendMessage(chatId, HELP_TEXT);
  });

  bot.onText(/\/help/, async (msg) => {
    const chatId = msg.chat.id;
    userModes.delete(chatId);
    await bot.sendMessage(chatId, HELP_TEXT);
  });

  bot.onText(/\/number/, async (msg) => {
    const chatId = msg.chat.id;
    userModes.set(chatId, "numbering");
    await bot.sendMessage(
      chatId,
      "📋 *Numbering mode* activated.\n\nSend me a list of items (one per line) and I'll number them.",
      { parse_mode: "Markdown" }
    );
  });

  bot.onText(/\/grammar/, async (msg) => {
    const chatId = msg.chat.id;
    userModes.set(chatId, "grammar");
    await bot.sendMessage(
      chatId,
      "✏️ *Grammar check mode* activated.\n\nSend me any text in English, German, Russian, Uzbek, or another language and I'll fix the grammar and spelling.",
      { parse_mode: "Markdown" }
    );
  });

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text || text.startsWith("/")) return;

    const mode = userModes.get(chatId);

    if (!mode) {
      await bot.sendMessage(
        chatId,
        "Please choose a mode first:\n/number — number a list\n/grammar — fix grammar & spelling"
      );
      return;
    }

    try {
      if (mode === "numbering") {
        const result = numberList(text);
        await bot.sendMessage(chatId, result);
      } else if (mode === "grammar") {
        await bot.sendChatAction(chatId, "typing");
        const corrected = await checkGrammar(text);
        if (corrected === text) {
          await bot.sendMessage(chatId, "✅ No errors found! Your text looks great.");
        } else {
          await bot.sendMessage(chatId, `✅ Corrected:\n\n${corrected}`);
        }
      }
    } catch (err) {
      logger.error({ err }, "Error handling message");
      await bot.sendMessage(chatId, "Something went wrong. Please try again.");
    }
  });

  bot.on("polling_error", (err) => {
    logger.error({ err }, "Telegram polling error");
  });
}
