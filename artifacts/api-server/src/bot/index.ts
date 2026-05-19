import TelegramBot from "node-telegram-bot-api";
import { logger } from "../lib/logger";
import { numberList } from "./numbering";
import { checkGrammar } from "./grammar";
import { translateText, LANGUAGE_OPTIONS } from "./translate";
import { summarizeText } from "./summarize";
import { type UILang, UI_LANGUAGES, t } from "./i18n";

type BotMode = "numbering" | "grammar" | "translate" | "summarize" | null;

interface UserState {
  uiLang: UILang;
  mode: BotMode;
  // translate
  targetLanguage?: string;
  translationContext?: string;
  // shared (translate + summarize)
  pendingText?: string;
  attempt?: number;
  // summarize
  summarizeStyle?: string;
}

const userStates = new Map<number, UserState>();

function getState(chatId: number): UserState {
  return userStates.get(chatId) ?? { uiLang: "en", mode: null };
}

function setState(chatId: number, state: UserState): void {
  userStates.set(chatId, state);
}

// ── Keyboards ─────────────────────────────────────────────────────────────────

function buildMainKeyboard(uiLang: UILang): TelegramBot.ReplyKeyboardMarkup {
  const s = t(uiLang);
  return {
    keyboard: [
      [{ text: s.kbGrammar }, { text: s.kbNumber }],
      [{ text: s.kbTranslate }, { text: s.kbSummarize }],
      [{ text: s.kbLanguage }],
    ],
    resize_keyboard: true,
    is_persistent: true,
  };
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
    row.push({ text: LANGUAGE_OPTIONS[i]!.label, callback_data: `lang:${LANGUAGE_OPTIONS[i]!.code}` });
    if (LANGUAGE_OPTIONS[i + 1]) {
      row.push({ text: LANGUAGE_OPTIONS[i + 1]!.label, callback_data: `lang:${LANGUAGE_OPTIONS[i + 1]!.code}` });
    }
    rows.push(row);
  }
  return { inline_keyboard: rows };
}

function buildTranslateContextKeyboard(uiLang: UILang): TelegramBot.InlineKeyboardMarkup {
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

function buildSummarizeStyleKeyboard(uiLang: UILang): TelegramBot.InlineKeyboardMarkup {
  const s = t(uiLang);
  return {
    inline_keyboard: [
      [
        { text: s.summarizeStyleFormal, callback_data: "sum_ctx:formal" },
        { text: s.summarizeStyleCasual, callback_data: "sum_ctx:casual" },
      ],
    ],
  };
}

function buildAcceptRetryKeyboard(
  uiLang: UILang,
  acceptCb: string,
  retryCb: string
): TelegramBot.InlineKeyboardMarkup {
  const s = t(uiLang);
  return {
    inline_keyboard: [
      [
        { text: s.btnAccept, callback_data: acceptCb },
        { text: s.btnRetry, callback_data: retryCb },
      ],
    ],
  };
}

// Build a lookup: any button label (in any language) → action
function buildButtonMap(): Map<string, "grammar" | "numbering" | "translate" | "summarize" | "language"> {
  const map = new Map<string, "grammar" | "numbering" | "translate" | "summarize" | "language">();
  for (const lang of ["en", "ru", "uz"] as UILang[]) {
    const s = t(lang);
    map.set(s.kbGrammar, "grammar");
    map.set(s.kbNumber, "numbering");
    map.set(s.kbTranslate, "translate");
    map.set(s.kbSummarize, "summarize");
    map.set(s.kbLanguage, "language");
  }
  return map;
}

// ── Bot ───────────────────────────────────────────────────────────────────────

export function startBot(token: string): void {
  const bot = new TelegramBot(token, { polling: true });
  const buttonMap = buildButtonMap();

  logger.info("Telegram bot started");

  // /start — show language picker (no main keyboard yet; shown after language chosen)
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

  // /language
  bot.onText(/\/language/, async (msg) => {
    const chatId = msg.chat.id;
    const prev = getState(chatId);
    setState(chatId, { ...prev, mode: null });
    await bot.sendMessage(chatId, "🌐 Choose your interface language:", {
      reply_markup: buildUILangKeyboard(),
    });
  });

  // /help
  bot.onText(/\/help/, async (msg) => {
    const chatId = msg.chat.id;
    const state = getState(chatId);
    setState(chatId, { ...state, mode: null });
    await bot.sendMessage(chatId, t(state.uiLang).help, {
      reply_markup: buildMainKeyboard(state.uiLang),
    });
  });

  // /number
  bot.onText(/\/number/, async (msg) => {
    const chatId = msg.chat.id;
    const state = getState(chatId);
    setState(chatId, { ...state, mode: "numbering" });
    await bot.sendMessage(chatId, t(state.uiLang).numberActivated, {
      parse_mode: "Markdown",
      reply_markup: buildMainKeyboard(state.uiLang),
    });
  });

  // /grammar
  bot.onText(/\/grammar/, async (msg) => {
    const chatId = msg.chat.id;
    const state = getState(chatId);
    setState(chatId, { ...state, mode: "grammar" });
    await bot.sendMessage(chatId, t(state.uiLang).grammarActivated, {
      parse_mode: "Markdown",
      reply_markup: buildMainKeyboard(state.uiLang),
    });
  });

  // /translate
  bot.onText(/\/translate/, async (msg) => {
    const chatId = msg.chat.id;
    const state = getState(chatId);
    setState(chatId, { uiLang: state.uiLang, mode: "translate" });
    await bot.sendMessage(chatId, t(state.uiLang).translateActivated, {
      parse_mode: "Markdown",
      reply_markup: buildTranslateLangKeyboard(),
    });
  });

  // /summarize
  bot.onText(/\/summarize/, async (msg) => {
    const chatId = msg.chat.id;
    const state = getState(chatId);
    setState(chatId, { uiLang: state.uiLang, mode: "summarize" });
    await bot.sendMessage(chatId, t(state.uiLang).summarizeActivated, {
      parse_mode: "Markdown",
      reply_markup: buildSummarizeStyleKeyboard(state.uiLang),
    });
  });

  // ── Callback queries ─────────────────────────────────────────────────────────

  bot.on("callback_query", async (query) => {
    const chatId = query.message?.chat.id;
    if (!chatId || !query.data) return;

    const state = getState(chatId);
    const strings = t(state.uiLang);

    // UI language selection
    if (query.data.startsWith("ui_lang:")) {
      const newLang = query.data.slice(8) as UILang;
      setState(chatId, { ...state, uiLang: newLang, mode: null });
      const langLabel = UI_LANGUAGES.find((l) => l.code === newLang)?.label ?? newLang;
      await bot.answerCallbackQuery(query.id, { text: t(newLang).langSelected(langLabel) });
      await bot.editMessageText(`✅ ${langLabel}`, {
        chat_id: chatId,
        message_id: query.message?.message_id,
      });
      await bot.sendMessage(chatId, t(newLang).languageSet(langLabel), {
        reply_markup: buildMainKeyboard(newLang),
      });
      return;
    }

    // Target language selection (translate)
    if (query.data.startsWith("lang:")) {
      if (state.mode !== "translate") { await bot.answerCallbackQuery(query.id); return; }
      const targetLanguage = query.data.slice(5);
      setState(chatId, { ...state, targetLanguage, translationContext: undefined, pendingText: undefined, attempt: undefined });
      const langLabel = LANGUAGE_OPTIONS.find((l) => l.code === targetLanguage)?.label ?? targetLanguage;
      await bot.answerCallbackQuery(query.id, { text: strings.langSelected(langLabel) });
      await bot.editMessageText(strings.translateModeWithLang(langLabel), {
        chat_id: chatId,
        message_id: query.message?.message_id,
        parse_mode: "Markdown",
        reply_markup: buildTranslateContextKeyboard(state.uiLang),
      });
      return;
    }

    // Translation context selection
    if (query.data.startsWith("ctx:")) {
      if (state.mode !== "translate") { await bot.answerCallbackQuery(query.id); return; }
      const rawCtx = query.data.slice(4);
      const ctxLabelMap: Record<string, string> = {
        formal: strings.contextFormal,
        casual: strings.contextCasual,
        medical: strings.contextMedical,
        business: strings.contextBusiness,
      };
      const ctxLabel = ctxLabelMap[rawCtx] ?? rawCtx;
      setState(chatId, { ...state, translationContext: rawCtx, pendingText: undefined, attempt: undefined });
      await bot.answerCallbackQuery(query.id);
      await bot.editMessageText(strings.contextSet(ctxLabel), {
        chat_id: chatId,
        message_id: query.message?.message_id,
        parse_mode: "Markdown",
      });
      return;
    }

    // Summarize style selection
    if (query.data.startsWith("sum_ctx:")) {
      if (state.mode !== "summarize") { await bot.answerCallbackQuery(query.id); return; }
      const rawStyle = query.data.slice(8);
      const styleLabelMap: Record<string, string> = {
        formal: strings.summarizeStyleFormal,
        casual: strings.summarizeStyleCasual,
      };
      const styleLabel = styleLabelMap[rawStyle] ?? rawStyle;
      setState(chatId, { ...state, summarizeStyle: rawStyle, pendingText: undefined, attempt: undefined });
      await bot.answerCallbackQuery(query.id);
      await bot.editMessageText(strings.summarizeStyleSet(styleLabel), {
        chat_id: chatId,
        message_id: query.message?.message_id,
        parse_mode: "Markdown",
      });
      return;
    }

    // Accept translation
    if (query.data === "tr_accept") {
      setState(chatId, { ...state, pendingText: undefined, attempt: undefined });
      await bot.answerCallbackQuery(query.id);
      await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: query.message?.message_id });
      await bot.sendMessage(chatId, strings.translationAccepted, {
        reply_markup: buildMainKeyboard(state.uiLang),
      });
      return;
    }

    // Retry translation
    if (query.data === "tr_retry") {
      const { pendingText, targetLanguage, translationContext } = state;
      if (!pendingText || !targetLanguage || !translationContext) { await bot.answerCallbackQuery(query.id); return; }
      const attempt = (state.attempt ?? 1) + 1;
      setState(chatId, { ...state, attempt });
      await bot.answerCallbackQuery(query.id);
      await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: query.message?.message_id });
      await bot.sendChatAction(chatId, "typing");
      await bot.sendMessage(chatId, strings.retrying);
      try {
        const translated = await translateText(pendingText, targetLanguage, translationContext, attempt);
        const langLabel = LANGUAGE_OPTIONS.find((l) => l.code === targetLanguage)?.label ?? targetLanguage;
        await bot.sendMessage(chatId, strings.translated(langLabel, translated), {
          reply_markup: buildAcceptRetryKeyboard(state.uiLang, "tr_accept", "tr_retry"),
        });
      } catch (err) {
        logger.error({ err }, "Error retranslating");
        await bot.sendMessage(chatId, strings.error);
      }
      return;
    }

    // Accept summary
    if (query.data === "sum_accept") {
      setState(chatId, { ...state, pendingText: undefined, attempt: undefined });
      await bot.answerCallbackQuery(query.id);
      await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: query.message?.message_id });
      await bot.sendMessage(chatId, strings.summarizeAccepted, {
        reply_markup: buildMainKeyboard(state.uiLang),
      });
      return;
    }

    // Retry summary
    if (query.data === "sum_retry") {
      const { pendingText, summarizeStyle } = state;
      if (!pendingText || !summarizeStyle) { await bot.answerCallbackQuery(query.id); return; }
      const attempt = (state.attempt ?? 1) + 1;
      setState(chatId, { ...state, attempt });
      await bot.answerCallbackQuery(query.id);
      await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: query.message?.message_id });
      await bot.sendChatAction(chatId, "typing");
      await bot.sendMessage(chatId, strings.summarizeRetrying);
      try {
        const summary = await summarizeText(pendingText, summarizeStyle as "formal" | "casual", attempt);
        await bot.sendMessage(chatId, strings.summarized(summary), {
          reply_markup: buildAcceptRetryKeyboard(state.uiLang, "sum_accept", "sum_retry"),
        });
      } catch (err) {
        logger.error({ err }, "Error re-summarizing");
        await bot.sendMessage(chatId, strings.error);
      }
      return;
    }

    await bot.answerCallbackQuery(query.id);
  });

  // ── Incoming messages ─────────────────────────────────────────────────────────

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text || text.startsWith("/")) return;

    const state = getState(chatId);
    const strings = t(state.uiLang);

    // Check if the message is a keyboard button tap
    const buttonAction = buttonMap.get(text);
    if (buttonAction) {
      if (buttonAction === "language") {
        setState(chatId, { ...state, mode: null });
        await bot.sendMessage(chatId, "🌐 Choose your interface language:", {
          reply_markup: buildUILangKeyboard(),
        });
        return;
      }
      if (buttonAction === "grammar") {
        setState(chatId, { ...state, mode: "grammar" });
        await bot.sendMessage(chatId, strings.grammarActivated, {
          parse_mode: "Markdown",
          reply_markup: buildMainKeyboard(state.uiLang),
        });
        return;
      }
      if (buttonAction === "numbering") {
        setState(chatId, { ...state, mode: "numbering" });
        await bot.sendMessage(chatId, strings.numberActivated, {
          parse_mode: "Markdown",
          reply_markup: buildMainKeyboard(state.uiLang),
        });
        return;
      }
      if (buttonAction === "translate") {
        setState(chatId, { uiLang: state.uiLang, mode: "translate" });
        await bot.sendMessage(chatId, strings.translateActivated, {
          parse_mode: "Markdown",
          reply_markup: buildTranslateLangKeyboard(),
        });
        return;
      }
      if (buttonAction === "summarize") {
        setState(chatId, { uiLang: state.uiLang, mode: "summarize" });
        await bot.sendMessage(chatId, strings.summarizeActivated, {
          parse_mode: "Markdown",
          reply_markup: buildSummarizeStyleKeyboard(state.uiLang),
        });
        return;
      }
    }

    // No mode selected
    if (!state.mode) {
      await bot.sendMessage(chatId, strings.chooseMode, {
        reply_markup: buildMainKeyboard(state.uiLang),
      });
      return;
    }

    try {
      // Numbering
      if (state.mode === "numbering") {
        await bot.sendMessage(chatId, numberList(text), {
          reply_markup: buildMainKeyboard(state.uiLang),
        });

      // Grammar
      } else if (state.mode === "grammar") {
        await bot.sendChatAction(chatId, "typing");
        const corrected = await checkGrammar(text);
        await bot.sendMessage(
          chatId,
          corrected === text ? strings.noErrors : strings.corrected(corrected),
          { reply_markup: buildMainKeyboard(state.uiLang) }
        );

      // Translate
      } else if (state.mode === "translate") {
        if (!state.targetLanguage) {
          await bot.sendMessage(chatId, strings.pickTargetLanguage, { reply_markup: buildTranslateLangKeyboard() });
          return;
        }
        if (!state.translationContext) {
          await bot.sendMessage(chatId, strings.askContext, { reply_markup: buildTranslateContextKeyboard(state.uiLang) });
          return;
        }
        await bot.sendChatAction(chatId, "typing");
        const translated = await translateText(text, state.targetLanguage, state.translationContext, 1);
        setState(chatId, { ...state, pendingText: text, attempt: 1 });
        const langLabel = LANGUAGE_OPTIONS.find((l) => l.code === state.targetLanguage)?.label ?? state.targetLanguage;
        await bot.sendMessage(chatId, strings.translated(langLabel, translated), {
          reply_markup: buildAcceptRetryKeyboard(state.uiLang, "tr_accept", "tr_retry"),
        });

      // Summarize
      } else if (state.mode === "summarize") {
        if (!state.summarizeStyle) {
          await bot.sendMessage(chatId, strings.askSummarizeStyle, { reply_markup: buildSummarizeStyleKeyboard(state.uiLang) });
          return;
        }
        await bot.sendChatAction(chatId, "typing");
        const summary = await summarizeText(text, state.summarizeStyle as "formal" | "casual", 1);
        setState(chatId, { ...state, pendingText: text, attempt: 1 });
        await bot.sendMessage(chatId, strings.summarized(summary), {
          reply_markup: buildAcceptRetryKeyboard(state.uiLang, "sum_accept", "sum_retry"),
        });
      }
    } catch (err) {
      logger.error({ err }, "Error handling message");
      await bot.sendMessage(chatId, strings.error, {
        reply_markup: buildMainKeyboard(state.uiLang),
      });
    }
  });

  bot.on("polling_error", (err) => {
    logger.error({ err }, "Telegram polling error");
  });
}
