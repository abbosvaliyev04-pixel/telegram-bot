import TelegramBot from "node-telegram-bot-api";
import { logger } from "../lib/logger";
import { numberList } from "./numbering";
import { checkGrammar } from "./grammar";
import { translateText, LANGUAGE_OPTIONS } from "./translate";
import { type UILang, UI_LANGUAGES, t } from "./i18n";

type BotMode = "numbering" | "grammar" | "translate" | null;

interface UserState {
  uiLang: UILang;
  mode: BotMode;
  targetLanguage?: string;
  translationContext?: string;
  pendingText?: string;
  translationAttempt?: number;
}

const userStates = new Map<number, UserState>();

function getState(chatId: number): UserState {
  return userStates.get(chatId) ?? { uiLang: "en", mode: null };
}

function setState(chatId: number, state: UserState): void {
  userStates.set(chatId, state);
}

function buildUILangKeyboard(): TelegramBot.InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      UI_LANGUAGES.map((l) => ({
        text: l.label,
        callback_data: `ui_lang:${l.code}`,
      })),
    ],
  };
}

function buildTranslateLangKeyboard(): TelegramBot.InlineKeyboardMarkup {
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

function buildContextKeyboard(uiLang: UILang): TelegramBot.InlineKeyboardMarkup {
  const s = t(uiLang);
  return {
    inline_keyboard: [
      [
        { text: s.contextFormal, callback_data: "ctx:formal" },
        { text: s.contextCasual, callback_data: "ctx:casual" },
      ],
      [
        { text: s.contextMedical, callback_data: "ctx:medical" },
        { text: s.contextBusiness, callback_data: "ctx:business" },
      ],
    ],
  };
}

function buildAcceptRetryKeyboard(uiLang: UILang): TelegramBot.InlineKeyboardMarkup {
  const s = t(uiLang);
  return {
    inline_keyboard: [
      [
        { text: s.btnAccept, callback_data: "tr_accept" },
        { text: s.btnRetry, callback_data: "tr_retry" },
      ],
    ],
  };
}

export function startBot(token: string): void {
  const bot = new TelegramBot(token, { polling: true });

  logger.info("Telegram bot started");

  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const prev = getState(chatId);
    setState(chatId, { ...prev, mode: null });
    await bot.sendMessage(
      chatId,
      "👋 Welcome! / Добро пожаловать! / Xush kelibsiz!\n\nChoose your language:",
      { reply_markup: buildUILangKeyboard() }
    );
  });

  bot.onText(/\/language/, async (msg) => {
    const chatId = msg.chat.id;
    const prev = getState(chatId);
    setState(chatId, { ...prev, mode: null });
    await bot.sendMessage(chatId, "🌐 Choose your interface language:", {
      reply_markup: buildUILangKeyboard(),
    });
  });

  bot.onText(/\/help/, async (msg) => {
    const chatId = msg.chat.id;
    const state = getState(chatId);
    setState(chatId, { ...state, mode: null });
    await bot.sendMessage(chatId, t(state.uiLang).help);
  });

  bot.onText(/\/number/, async (msg) => {
    const chatId = msg.chat.id;
    const state = getState(chatId);
    setState(chatId, { ...state, mode: "numbering" });
    await bot.sendMessage(chatId, t(state.uiLang).numberActivated, {
      parse_mode: "Markdown",
    });
  });

  bot.onText(/\/grammar/, async (msg) => {
    const chatId = msg.chat.id;
    const state = getState(chatId);
    setState(chatId, { ...state, mode: "grammar" });
    await bot.sendMessage(chatId, t(state.uiLang).grammarActivated, {
      parse_mode: "Markdown",
    });
  });

  bot.onText(/\/translate/, async (msg) => {
    const chatId = msg.chat.id;
    const state = getState(chatId);
    setState(chatId, {
      ...state,
      mode: "translate",
      targetLanguage: undefined,
      translationContext: undefined,
      pendingText: undefined,
      translationAttempt: undefined,
    });
    await bot.sendMessage(chatId, t(state.uiLang).translateActivated, {
      parse_mode: "Markdown",
      reply_markup: buildTranslateLangKeyboard(),
    });
  });

  bot.on("callback_query", async (query) => {
    const chatId = query.message?.chat.id;
    if (!chatId || !query.data) return;

    const state = getState(chatId);
    const strings = t(state.uiLang);

    // ── UI language selection ────────────────────────────────────────────
    if (query.data.startsWith("ui_lang:")) {
      const newLang = query.data.slice(8) as UILang;
      setState(chatId, { ...state, uiLang: newLang, mode: null });
      const langLabel =
        UI_LANGUAGES.find((l) => l.code === newLang)?.label ?? newLang;
      await bot.answerCallbackQuery(query.id, {
        text: t(newLang).langSelected(langLabel),
      });
      await bot.editMessageText(t(newLang).languageSet(langLabel), {
        chat_id: chatId,
        message_id: query.message?.message_id,
      });
      return;
    }

    // ── Target language selection ────────────────────────────────────────
    if (query.data.startsWith("lang:")) {
      const targetLanguage = query.data.slice(5);
      if (state.mode !== "translate") {
        await bot.answerCallbackQuery(query.id);
        return;
      }
      setState(chatId, {
        ...state,
        targetLanguage,
        translationContext: undefined,
        pendingText: undefined,
        translationAttempt: undefined,
      });
      const langLabel =
        LANGUAGE_OPTIONS.find((l) => l.code === targetLanguage)?.label ??
        targetLanguage;
      await bot.answerCallbackQuery(query.id, {
        text: strings.langSelected(langLabel),
      });
      await bot.editMessageText(strings.translateModeWithLang(langLabel), {
        chat_id: chatId,
        message_id: query.message?.message_id,
        parse_mode: "Markdown",
        reply_markup: buildContextKeyboard(state.uiLang),
      });
      return;
    }

    // ── Context selection ────────────────────────────────────────────────
    if (query.data.startsWith("ctx:")) {
      const rawCtx = query.data.slice(4);
      if (state.mode !== "translate") {
        await bot.answerCallbackQuery(query.id);
        return;
      }
      const ctxLabelMap: Record<string, string> = {
        formal: strings.contextFormal,
        casual: strings.contextCasual,
        medical: strings.contextMedical,
        business: strings.contextBusiness,
      };
      const ctxLabel = ctxLabelMap[rawCtx] ?? rawCtx;
      setState(chatId, {
        ...state,
        translationContext: rawCtx,
        pendingText: undefined,
        translationAttempt: undefined,
      });
      await bot.answerCallbackQuery(query.id);
      await bot.editMessageText(strings.contextSet(ctxLabel), {
        chat_id: chatId,
        message_id: query.message?.message_id,
        parse_mode: "Markdown",
      });
      return;
    }

    // ── Accept translation ───────────────────────────────────────────────
    if (query.data === "tr_accept") {
      setState(chatId, {
        ...state,
        pendingText: undefined,
        translationAttempt: undefined,
      });
      await bot.answerCallbackQuery(query.id);
      await bot.editMessageReplyMarkup(
        { inline_keyboard: [] },
        { chat_id: chatId, message_id: query.message?.message_id }
      );
      await bot.sendMessage(chatId, strings.translationAccepted);
      return;
    }

    // ── Retry translation ────────────────────────────────────────────────
    if (query.data === "tr_retry") {
      const { pendingText, targetLanguage, translationContext } = state;
      if (!pendingText || !targetLanguage || !translationContext) {
        await bot.answerCallbackQuery(query.id);
        return;
      }
      const attempt = (state.translationAttempt ?? 1) + 1;
      setState(chatId, { ...state, translationAttempt: attempt });
      await bot.answerCallbackQuery(query.id);
      await bot.editMessageReplyMarkup(
        { inline_keyboard: [] },
        { chat_id: chatId, message_id: query.message?.message_id }
      );
      await bot.sendChatAction(chatId, "typing");
      await bot.sendMessage(chatId, strings.retrying);
      try {
        const translated = await translateText(
          pendingText,
          targetLanguage,
          translationContext,
          attempt
        );
        const langLabel =
          LANGUAGE_OPTIONS.find((l) => l.code === targetLanguage)?.label ??
          targetLanguage;
        await bot.sendMessage(
          chatId,
          strings.translated(langLabel, translated),
          { reply_markup: buildAcceptRetryKeyboard(state.uiLang) }
        );
      } catch (err) {
        logger.error({ err }, "Error retranslating");
        await bot.sendMessage(chatId, strings.error);
      }
      return;
    }

    await bot.answerCallbackQuery(query.id);
  });

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text || text.startsWith("/")) return;

    const state = getState(chatId);
    const strings = t(state.uiLang);

    if (!state.mode) {
      await bot.sendMessage(chatId, strings.chooseMode);
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
          await bot.sendMessage(chatId, strings.noErrors);
        } else {
          await bot.sendMessage(chatId, strings.corrected(corrected));
        }
      } else if (state.mode === "translate") {
        if (!state.targetLanguage) {
          await bot.sendMessage(chatId, strings.pickTargetLanguage, {
            reply_markup: buildTranslateLangKeyboard(),
          });
          return;
        }
        if (!state.translationContext) {
          await bot.sendMessage(chatId, strings.askContext, {
            reply_markup: buildContextKeyboard(state.uiLang),
          });
          return;
        }
        await bot.sendChatAction(chatId, "typing");
        const translated = await translateText(
          text,
          state.targetLanguage,
          state.translationContext,
          1
        );
        setState(chatId, {
          ...state,
          pendingText: text,
          translationAttempt: 1,
        });
        const langLabel =
          LANGUAGE_OPTIONS.find((l) => l.code === state.targetLanguage)
            ?.label ?? state.targetLanguage;
        await bot.sendMessage(
          chatId,
          strings.translated(langLabel, translated),
          { reply_markup: buildAcceptRetryKeyboard(state.uiLang) }
        );
      }
    } catch (err) {
      logger.error({ err }, "Error handling message");
      await bot.sendMessage(chatId, strings.error);
    }
  });

  bot.on("polling_error", (err) => {
    logger.error({ err }, "Telegram polling error");
  });
}
