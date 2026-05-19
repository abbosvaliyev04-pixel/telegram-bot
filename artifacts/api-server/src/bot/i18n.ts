export type UILang = "en" | "ru" | "uz";

export const UI_LANGUAGES: Array<{ label: string; code: UILang }> = [
  { label: "🇬🇧 English", code: "en" },
  { label: "🇷🇺 Русский", code: "ru" },
  { label: "🇺🇿 O'zbek", code: "uz" },
];

interface Messages {
  chooseLanguage: string;
  languageSet: (lang: string) => string;
  help: string;
  numberActivated: string;
  grammarActivated: string;
  translateActivated: string;
  chooseTargetLanguage: string;
  translateModeWithLang: (lang: string) => string;
  askContext: string;
  contextFormal: string;
  contextCasual: string;
  contextMedical: string;
  contextBusiness: string;
  contextSet: (ctx: string) => string;
  btnAccept: string;
  btnRetry: string;
  translationAccepted: string;
  retrying: string;
  noErrors: string;
  corrected: (text: string) => string;
  translated: (lang: string, text: string) => string;
  chooseMode: string;
  pickTargetLanguage: string;
  error: string;
  langSelected: (lang: string) => string;
}

const en: Messages = {
  chooseLanguage: "👋 Welcome! Please choose your language:",
  languageSet: (lang) => `✅ Language set to ${lang}. Here's what I can do:\n\n/number — Send a list of items and I'll number them 1 to N\n/grammar — Send any text and I'll fix grammar & spelling\n/translate — Translate text into a language of your choice\n/language — Change interface language\n/help — Show this message`,
  help: "👋 Here's what I can do:\n\n/number — Send a list of items and I'll number them 1 to N\n/grammar — Send any text and I'll fix grammar & spelling\n/translate — Translate text into a language of your choice\n/language — Change interface language\n/help — Show this message",
  numberActivated: "📋 *Numbering mode* activated.\n\nSend me a list of items (one per line) and I'll number them.",
  grammarActivated: "✏️ *Grammar check mode* activated.\n\nSend me any text and I'll fix the grammar and spelling.",
  translateActivated: "🌐 *Translate mode* activated.\n\nChoose the target language:",
  chooseTargetLanguage: "Please pick a target language first:",
  translateModeWithLang: (lang) => `🌐 Target language: *${lang}*\n\nWhat's the style of this text? This helps me translate more naturally.`,
  askContext: "What's the style of this text?",
  contextFormal: "🏢 Formal",
  contextCasual: "💬 Casual",
  contextMedical: "🏥 Medical",
  contextBusiness: "💼 Business",
  contextSet: (ctx) => `Got it — *${ctx}* style.\n\nNow send me the text to translate.`,
  btnAccept: "✅ Accept",
  btnRetry: "🔄 Try again",
  translationAccepted: "✅ Translation accepted. Send another text or use /help.",
  retrying: "🔄 Retranslating with different wording...",
  noErrors: "✅ No errors found! Your text looks great.",
  corrected: (text) => `✅ Corrected:\n\n${text}`,
  translated: (lang, text) => `${lang}:\n\n${text}`,
  chooseMode: "Please choose a mode first:\n/number — number a list\n/grammar — fix grammar & spelling\n/translate — translate text",
  pickTargetLanguage: "Please pick a target language first:",
  error: "Something went wrong. Please try again.",
  langSelected: (lang) => `${lang} selected`,
};

const ru: Messages = {
  chooseLanguage: "👋 Добро пожаловать! Выберите язык интерфейса:",
  languageSet: (lang) => `✅ Язык установлен: ${lang}. Вот что я умею:\n\n/number — Пришлите список, и я пронумерую его от 1 до N\n/grammar — Пришлите текст, и я исправлю грамматику и орфографию\n/translate — Переведите текст на выбранный язык\n/language — Изменить язык интерфейса\n/help — Показать это сообщение`,
  help: "👋 Вот что я умею:\n\n/number — Пришлите список, и я пронумерую его от 1 до N\n/grammar — Пришлите текст, и я исправлю грамматику и орфографию\n/translate — Переведите текст на выбранный язык\n/language — Изменить язык интерфейса\n/help — Показать это сообщение",
  numberActivated: "📋 *Режим нумерации* активирован.\n\nПришлите список элементов (каждый с новой строки), и я пронумерую их.",
  grammarActivated: "✏️ *Режим проверки грамматики* активирован.\n\nПришлите любой текст, и я исправлю грамматику и орфографию.",
  translateActivated: "🌐 *Режим перевода* активирован.\n\nВыберите язык перевода:",
  chooseTargetLanguage: "Сначала выберите язык перевода:",
  translateModeWithLang: (lang) => `🌐 Язык перевода: *${lang}*\n\nКакой стиль у этого текста? Это поможет мне перевести точнее.`,
  askContext: "Какой стиль у этого текста?",
  contextFormal: "🏢 Официальный",
  contextCasual: "💬 Разговорный",
  contextMedical: "🏥 Медицинский",
  contextBusiness: "💼 Деловой",
  contextSet: (ctx) => `Понял — стиль *${ctx}*.\n\nТеперь пришлите текст для перевода.`,
  btnAccept: "✅ Принять",
  btnRetry: "🔄 Попробовать снова",
  translationAccepted: "✅ Перевод принят. Пришлите следующий текст или воспользуйтесь /help.",
  retrying: "🔄 Переводю заново с другими формулировками...",
  noErrors: "✅ Ошибок не найдено! Ваш текст выглядит отлично.",
  corrected: (text) => `✅ Исправлено:\n\n${text}`,
  translated: (lang, text) => `${lang}:\n\n${text}`,
  chooseMode: "Сначала выберите режим:\n/number — нумерация списка\n/grammar — проверка грамматики\n/translate — перевод текста",
  pickTargetLanguage: "Сначала выберите язык перевода:",
  error: "Что-то пошло не так. Попробуйте ещё раз.",
  langSelected: (lang) => `${lang} выбран`,
};

const uz: Messages = {
  chooseLanguage: "👋 Xush kelibsiz! Interfeys tilini tanlang:",
  languageSet: (lang) => `✅ Til tanlandi: ${lang}. Men nima qila olaman:\n\n/number — Ro'yxat yuboring, men ularni 1 dan N gacha raqamlashim\n/grammar — Matn yuboring, men grammatika va imlo xatolarini tuzataman\n/translate — Matnni tanlangan tilga tarjima qilaman\n/language — Interfeys tilini o'zgartirish\n/help — Ushbu xabarni ko'rsatish`,
  help: "👋 Men nima qila olaman:\n\n/number — Ro'yxat yuboring, men ularni 1 dan N gacha raqamlashim\n/grammar — Matn yuboring, men grammatika va imlo xatolarini tuzataman\n/translate — Matnni tanlangan tilga tarjima qilaman\n/language — Interfeys tilini o'zgartirish\n/help — Ushbu xabarni ko'rsatish",
  numberActivated: "📋 *Raqamlash rejimi* faollashtirildi.\n\nMenga ro'yxat elementlarini yuboring (har biri yangi qatorda) va men ularni raqamlayman.",
  grammarActivated: "✏️ *Grammatika tekshiruvi rejimi* faollashtirildi.\n\nIstalgan matn yuboring, men grammatika va imlo xatolarini tuzataman.",
  translateActivated: "🌐 *Tarjima rejimi* faollashtirildi.\n\nTarjima tilini tanlang:",
  chooseTargetLanguage: "Avval tarjima tilini tanlang:",
  translateModeWithLang: (lang) => `🌐 Tarjima tili: *${lang}*\n\nMatnning uslubi qanday? Bu menga aniqroq tarjima qilishga yordam beradi.`,
  askContext: "Matnning uslubi qanday?",
  contextFormal: "🏢 Rasmiy",
  contextCasual: "💬 Oddiy",
  contextMedical: "🏥 Tibbiy",
  contextBusiness: "💼 Biznes",
  contextSet: (ctx) => `Tushundim — *${ctx}* uslubi.\n\nEndi tarjima qilmoqchi bo'lgan matnni yuboring.`,
  btnAccept: "✅ Qabul qilish",
  btnRetry: "🔄 Qayta urinish",
  translationAccepted: "✅ Tarjima qabul qilindi. Keyingi matnni yuboring yoki /help dan foydalaning.",
  retrying: "🔄 Boshqacha so'zlar bilan qayta tarjima qilinmoqda...",
  noErrors: "✅ Xato topilmadi! Matningiz zo'r ko'rinadi.",
  corrected: (text) => `✅ Tuzatildi:\n\n${text}`,
  translated: (lang, text) => `${lang}:\n\n${text}`,
  chooseMode: "Avval rejimni tanlang:\n/number — ro'yxatni raqamlash\n/grammar — grammatikani tekshirish\n/translate — matnni tarjima qilish",
  pickTargetLanguage: "Avval tarjima tilini tanlang:",
  error: "Nimadir xato ketdi. Qaytadan urinib ko'ring.",
  langSelected: (lang) => `${lang} tanlandi`,
};

const translations: Record<UILang, Messages> = { en, ru, uz };

export function t(lang: UILang): Messages {
  return translations[lang];
}
