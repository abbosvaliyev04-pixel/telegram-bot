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
  translateModeWithLang: (lang) => `🌐 *Translate mode* — target: *${lang}*\n\nNow send me the text you want to translate.`,
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
  translateModeWithLang: (lang) => `🌐 *Режим перевода* — язык: *${lang}*\n\nТеперь пришлите текст для перевода.`,
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
  translateModeWithLang: (lang) => `🌐 *Tarjima rejimi* — til: *${lang}*\n\nEndi tarjima qilmoqchi bo'lgan matnni yuboring.`,
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
