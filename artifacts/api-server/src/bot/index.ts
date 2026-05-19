import TelegramBot from "node-telegram-bot-api";
import { logger } from "../lib/logger";
import { numberList } from "./numbering";
import { checkGrammar } from "./grammar";
import { translateText, LANGUAGE_OPTIONS } from "./translate";

type BotMode = "numbering" | "grammar" | "translate" | null;

interface UserState {
  mode: BotMode;
  targetLanguage?: string;
}

const userStates = new Map<number, UserState>();

const HELP_TEXT = `👋 Hello! Here's what I can do:

/number — Send a list of items and I'll number them 1 to N
/grammar — Send any text and I'll fix the grammar & spelling (English, German, Russian, Uzbek, and more)
/translate — Translate text into a language of your choice
/help — Show this message`;

function getState(chatId: number): UserState {
  return userStates.get(chatId) ?? { mode: null };
}

function setState(chatId: number, state: UserState): void {
  userStates.set(chatId, state);
}

function clearState(chatId: number): void {
  userStates.delete(chatId);
}

function buildLanguageKeyboard(): TelegramBot.InlineKeyboardMarkup {
  const rows: TelegramBot.InlineKeyboardButton[][] = [];
  for (let i = 0; i < LANGUAGE_OPTIONS.length; i += 2) {
    const row: TelegramBot.InlineKeyboardButton[] = [];
    row.push({
      text: LANGUAGE_OPTIONS[i]!.label,
      callback_data: `lang:${LANGUAGE_OPTIONS[i]!.code}`,
    });
    if (LANGUAGE_OPTIONS[i + 1]) {
      row.push({
        text: LANGUAGE_OPTIONS[i + 1]!.label,
        callback_data: `lang:${LANGUAGE_OPTIONS[i + 1]!.code}`,
      });
    }
    rows.push(row);
  }
  return { inline_keyboard: rows };
}

export function startBot(token: string): void {
  const bot = new TelegramBot(token, { polling: true });

  logger.info("Telegram bot started");

  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    clearState(chatId);
    await bot.sendMessage(chatId, HELP_TEXT);
  });

  bot.onText(/\/help/, async (msg) => {
    const chatId = msg.chat.id;
    clearState(chatId);
    await bot.sendMessage(chatId, HELP_TEXT);
  });

  bot.onText(/\/number/, async (msg) => {
    const chatId = msg.chat.id;
    setState(chatId, { mode: "numbering" });
    await bot.sendMessage(
      chatId,
      "📋 *Numbering mode* activated.\n\nSend me a list of items (one per line) and I'll number them.",
      { parse_mode: "Markdown" }
    );
  });

  bot.onText(/\/grammar/, async (msg) => {
    const chatId = msg.chat.id;
    setState(chatId, { mode: "grammar" });
    await bot.sendMessage(
      chatId,
      "✏️ *Grammar check mode* activated.\n\nSend me any text in English, German, Russian, Uzbek, or another language and I'll fix the grammar and spelling.",
      { parse_mode: "Markdown" }
    );
  });

  bot.onText(/\/translate/, async (msg) => {
    const chatId = msg.chat.id;
    setState(chatId, { mode: "translate" });
    await bot.sendMessage(
      chatId,
      "🌐 *Translate mode* activated.\n\nChoose the target language:",
      {
        parse_mode: "Markdown",
        reply_markup: buildLanguageKeyboard(),
      }
    );
  });

  bot.on("callback_query", async (query) => {
    const chatId = query.message?.chat.id;
    if (!chatId || !query.data?.startsWith("lang:")) return;

    const targetLanguage = query.data.slice(5);
    const state = getState(chatId);

    if (state.mode !== "translate") {
      await bot.answerCallbackQuery(query.id);
      return;
    }

    setState(chatId, { mode: "translate", targetLanguage });

    const langLabel =
      LANGUAGE_OPTIONS.find((l) => l.code === targetLanguage)?.label ??
      targetLanguage;

    await bot.answerCallbackQuery(query.id, {
      text: `${langLabel} selected`,
    });

    await bot.editMessageText(
      `🌐 *Translate mode* — target: *${langLabel}*\n\nNow send me the text you want to translate.`,
      {
        chat_id: chatId,
        message_id: query.message?.message_id,
        parse_mode: "Markdown",
      }
    );
  });

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text || text.startsWith("/")) return;

    const state = getState(chatId);

    if (!state.mode) {
      await bot.sendMessage(
        chatId,
        "Please choose a mode first:\n/number — number a list\n/grammar — fix grammar & spelling\n/translate — translate text"
      );
      return;
    }

    try {
      if (state.mode === "numbering") {
        const result = numberList(text);
        await bot.sendMessage(chatId, result);
      } else if (state.mode === "grammar") {
        await bot.sendChatAction(chatId, "typing");
        const corrected = await checkGrammar(text);
        if (corrected === text) {
          await bot.sendMessage(chatId, "✅ No errors found! Your text looks great.");
        } else {
          await bot.sendMessage(chatId, `✅ Corrected:\n\n${corrected}`);
        }
      } else if (state.mode === "translate") {
        if (!state.targetLanguage) {
          await bot.sendMessage(
            chatId,
            "Please pick a target language first:",
            { reply_markup: buildLanguageKeyboard() }
          );
          return;
        }
        await bot.sendChatAction(chatId, "typing");
        const translated = await translateText(text, state.targetLanguage);
        const langLabel =
          LANGUAGE_OPTIONS.find((l) => l.code === state.targetLanguage)
            ?.label ?? state.targetLanguage;
        await bot.sendMessage(chatId, `${langLabel}:\n\n${translated}`);
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
