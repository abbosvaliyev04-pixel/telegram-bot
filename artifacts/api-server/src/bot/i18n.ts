export type UILang = "en" | "ru" | "uz";

export const UI_LANGUAGES: Array<{ label: string; code: UILang }> = [
  { label: "🇬🇧 English", code: "en" },
  { label: "🇷🇺 Русский", code: "ru" },
  { label: "🇺🇿 O'zbek", code: "uz" },
];

interface Messages {
  // General
  chooseLanguage: string;
  languageSet: (lang: string) => string;
  help: string;
  chooseMode: string;
  error: string;
  langSelected: (lang: string) => string;
  // Shared buttons
  btnAccept: string;
  btnRetry: string;
  // Numbering
  numberActivated: string;
  // Grammar
  grammarActivated: string;
  noErrors: string;
  corrected: (text: string) => string;
  // Translation
  translateActivated: string;
  chooseTargetLanguage: string;
  translateModeWithLang: (lang: string) => string;
  askContext: string;
  contextFormal: string;
  contextCasual: string;
  contextMedical: string;
  contextBusiness: string;
  contextSet: (ctx: string) => string;
  translated: (lang: string, text: string) => string;
  translationAccepted: string;
  retrying: string;
  pickTargetLanguage: string;
  // Summarize
  summarizeActivated: string;
  askSummarizeStyle: string;
  summarizeStyleFormal: string;
  summarizeStyleCasual: string;
  summarizeStyleSet: (style: string) => string;
  summarized: (text: string) => string;
  summarizeAccepted: string;
  summarizeRetrying: string;
}

const en: Messages = {
  chooseLanguage: "👋 Welcome! Please choose your language:",
  languageSet: (lang) =>
    `✅ Language set to ${lang}. Here's what I can do:\n\n/number — Send me a list of items and I will number each one in order: 1, 2, 3...\n/grammar — Fix grammar & spelling\n/translate — Translate text to any language\n/summarize — Shorten & summarize text\n/language — Change interface language\n/help — Show this message`,
  help: "👋 Here's what I can do:\n\n/number — Send me a list of items and I will number each one in order: 1, 2, 3...\n/grammar — Fix grammar & spelling\n/translate — Translate text to any language\n/summarize — Shorten & summarize text\n/language — Change interface language\n/help — Show this message",
  chooseMode:
    "Please choose a mode first:\n/number — number each item in order: 1, 2, 3...\n/grammar — fix grammar & spelling\n/translate — translate text\n/summarize — shorten text",
  error: "Something went wrong. Please try again.",
  langSelected: (lang) => `${lang} selected`,
  btnAccept: "✅ Accept",
  btnRetry: "🔄 Try again",
  numberActivated:
    "📋 *Numbering mode* activated.\n\nSend me a list of items and I will number each one in order: 1, 2, 3...",
  grammarActivated:
    "✏️ *Grammar check mode* activated.\n\nSend me any text and I'll fix the grammar and spelling.",
  noErrors: "✅ No errors found! Your text looks great.",
  corrected: (text) => `✅ Corrected:\n\n${text}`,
  translateActivated: "🌐 *Translate mode* activated.\n\nChoose the target language:",
  chooseTargetLanguage: "Please pick a target language first:",
  translateModeWithLang: (lang) =>
    `🌐 Target language: *${lang}*\n\nWhat's the style of this text? This helps me translate more naturally.`,
  askContext: "What's the style of this text?",
  contextFormal: "🏢 Formal",
  contextCasual: "💬 Casual",
  contextMedical: "🏥 Medical",
  contextBusiness: "💼 Business",
  contextSet: (ctx) => `Got it — *${ctx}* style.\n\nNow send me the text to translate.`,
  translated: (lang, text) => `${lang}:\n\n${text}`,
  translationAccepted: "✅ Translation accepted. Send another text or use /help.",
  retrying: "🔄 Retranslating with different wording...",
  pickTargetLanguage: "Please pick a target language first:",
  summarizeActivated:
    "✂️ *Summarize mode* activated.\n\nChoose the style for your summary:",
  askSummarizeStyle: "Choose the style for your summary:",
  summarizeStyleFormal: "📋 Formal",
  summarizeStyleCasual: "💬 Casual",
  summarizeStyleSet: (style) =>
    `Got it — *${style}* style.\n\nNow send me the text you want summarized.`,
  summarized: (text) => `✂️ Summary:\n\n${text}`,
  summarizeAccepted: "✅ Summary accepted. Send another text or use /help.",
  summarizeRetrying: "🔄 Generating a different summary...",
};

const ru: Messages = {
  chooseLanguage: "👋 Добро пожаловать! Выберите язык интерфейса:",
  languageSet: (lang) =>
    `✅ Язык установлен: ${lang}. Вот что я умею:\n\n/number — Отправьте список, и я пронумерую каждый пункт по порядку: 1, 2, 3...\n/grammar — Исправить грамматику и орфографию\n/translate — Перевести текст на любой язык\n/summarize — Сократить и пересказать текст\n/language — Изменить язык интерфейса\n/help — Показать это сообщение`,
  help: "👋 Вот что я умею:\n\n/number — Отправьте список, и я пронумерую каждый пункт по порядку: 1, 2, 3...\n/grammar — Исправить грамматику и орфографию\n/translate — Перевести текст на любой язык\n/summarize — Сократить и пересказать текст\n/language — Изменить язык интерфейса\n/help — Показать это сообщение",
  chooseMode:
    "Сначала выберите режим:\n/number — пронумеровать каждый пункт: 1, 2, 3...\n/grammar — проверка грамматики\n/translate — перевод текста\n/summarize — сокращение текста",
  error: "Что-то пошло не так. Попробуйте ещё раз.",
  langSelected: (lang) => `${lang} выбран`,
  btnAccept: "✅ Принять",
  btnRetry: "🔄 Попробовать снова",
  numberActivated:
    "📋 *Режим нумерации* активирован.\n\nОтправьте список, и я пронумерую каждый пункт по порядку: 1, 2, 3...",
  grammarActivated:
    "✏️ *Режим проверки грамматики* активирован.\n\nПришлите любой текст, и я исправлю грамматику и орфографию.",
  noErrors: "✅ Ошибок не найдено! Ваш текст выглядит отлично.",
  corrected: (text) => `✅ Исправлено:\n\n${text}`,
  translateActivated: "🌐 *Режим перевода* активирован.\n\nВыберите язык перевода:",
  chooseTargetLanguage: "Сначала выберите язык перевода:",
  translateModeWithLang: (lang) =>
    `🌐 Язык перевода: *${lang}*\n\nКакой стиль у этого текста? Это поможет мне перевести точнее.`,
  askContext: "Какой стиль у этого текста?",
  contextFormal: "🏢 Официальный",
  contextCasual: "💬 Разговорный",
  contextMedical: "🏥 Медицинский",
  contextBusiness: "💼 Деловой",
  contextSet: (ctx) => `Понял — стиль *${ctx}*.\n\nТеперь пришлите текст для перевода.`,
  translated: (lang, text) => `${lang}:\n\n${text}`,
  translationAccepted:
    "✅ Перевод принят. Пришлите следующий текст или воспользуйтесь /help.",
  retrying: "🔄 Переводю заново с другими формулировками...",
  pickTargetLanguage: "Сначала выберите язык перевода:",
  summarizeActivated:
    "✂️ *Режим сокращения* активирован.\n\nВыберите стиль краткого изложения:",
  askSummarizeStyle: "Выберите стиль краткого изложения:",
  summarizeStyleFormal: "📋 Официальный",
  summarizeStyleCasual: "💬 Разговорный",
  summarizeStyleSet: (style) =>
    `Понял — стиль *${style}*.\n\nТеперь пришлите текст для сокращения.`,
  summarized: (text) => `✂️ Краткое изложение:\n\n${text}`,
  summarizeAccepted:
    "✅ Изложение принято. Пришлите следующий текст или воспользуйтесь /help.",
  summarizeRetrying: "🔄 Генерирую другой вариант краткого изложения...",
};

const uz: Messages = {
  chooseLanguage: "👋 Xush kelibsiz! Interfeys tilini tanlang:",
  languageSet: (lang) =>
    `✅ Til tanlandi: ${lang}. Men nima qila olaman:\n\n/number — Narsalar ro'yxatini yuboring, men har biriga 1, 2, 3... tartibida raqam qo'yib beraman\n/grammar — Grammatika va imlo xatolarini tuzatish\n/translate — Matnni istalgan tilga tarjima qilish\n/summarize — Matnni qisqartirish va xulosa chiqarish\n/language — Interfeys tilini o'zgartirish\n/help — Ushbu xabarni ko'rsatish`,
  help: "👋 Men nima qila olaman:\n\n/number — Narsalar ro'yxatini yuboring, men har biriga 1, 2, 3... tartibida raqam qo'yib beraman\n/grammar — Grammatika va imlo xatolarini tuzatish\n/translate — Matnni istalgan tilga tarjima qilish\n/summarize — Matnni qisqartirish va xulosa chiqarish\n/language — Interfeys tilini o'zgartirish\n/help — Ushbu xabarni ko'rsatish",
  chooseMode:
    "Avval rejimni tanlang:\n/number — har biriga 1, 2, 3... raqam qo'yish\n/grammar — grammatikani tekshirish\n/translate — matnni tarjima qilish\n/summarize — matnni qisqartirish",
  error: "Nimadir xato ketdi. Qaytadan urinib ko'ring.",
  langSelected: (lang) => `${lang} tanlandi`,
  btnAccept: "✅ Qabul qilish",
  btnRetry: "🔄 Qayta urinish",
  numberActivated:
    "📋 *Raqamlash rejimi* faollashtirildi.\n\nNarsalar ro'yxatini yuboring, men har biriga 1, 2, 3... tartibida raqam qo'yib beraman.",
  grammarActivated:
    "✏️ *Grammatika tekshiruvi rejimi* faollashtirildi.\n\nIstalgan matn yuboring, men grammatika va imlo xatolarini tuzataman.",
  noErrors: "✅ Xato topilmadi! Matningiz zo'r ko'rinadi.",
  corrected: (text) => `✅ Tuzatildi:\n\n${text}`,
  translateActivated: "🌐 *Tarjima rejimi* faollashtirildi.\n\nTarjima tilini tanlang:",
  chooseTargetLanguage: "Avval tarjima tilini tanlang:",
  translateModeWithLang: (lang) =>
    `🌐 Tarjima tili: *${lang}*\n\nMatnning uslubi qanday? Bu menga aniqroq tarjima qilishga yordam beradi.`,
  askContext: "Matnning uslubi qanday?",
  contextFormal: "🏢 Rasmiy",
  contextCasual: "💬 Oddiy",
  contextMedical: "🏥 Tibbiy",
  contextBusiness: "💼 Biznes",
  contextSet: (ctx) =>
    `Tushundim — *${ctx}* uslubi.\n\nEndi tarjima qilmoqchi bo'lgan matnni yuboring.`,
  translated: (lang, text) => `${lang}:\n\n${text}`,
  translationAccepted:
    "✅ Tarjima qabul qilindi. Keyingi matnni yuboring yoki /help dan foydalaning.",
  retrying: "🔄 Boshqacha so'zlar bilan qayta tarjima qilinmoqda...",
  pickTargetLanguage: "Avval tarjima tilini tanlang:",
  summarizeActivated:
    "✂️ *Qisqartirish rejimi* faollashtirildi.\n\nXulosa uslubini tanlang:",
  askSummarizeStyle: "Xulosa uslubini tanlang:",
  summarizeStyleFormal: "📋 Rasmiy",
  summarizeStyleCasual: "💬 Oddiy",
  summarizeStyleSet: (style) =>
    `Tushundim — *${style}* uslubi.\n\nEndi qisqartirmoqchi bo'lgan matnni yuboring.`,
  summarized: (text) => `✂️ Qisqacha mazmun:\n\n${text}`,
  summarizeAccepted:
    "✅ Xulosa qabul qilindi. Keyingi matnni yuboring yoki /help dan foydalaning.",
  summarizeRetrying: "🔄 Boshqacha xulosa tayyorlanmoqda...",
};

const translations: Record<UILang, Messages> = { en, ru, uz };

export function t(lang: UILang): Messages {
  return translations[lang];
}
