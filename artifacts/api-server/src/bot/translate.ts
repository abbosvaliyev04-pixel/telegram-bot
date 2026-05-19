import { openai } from "@workspace/integrations-openai-ai-server";

export type TranslationContext = "formal" | "casual" | "medical" | "business";

export async function translateText(
  text: string,
  targetLanguage: string,
  context: TranslationContext | string,
  attempt: number = 1
): Promise<string> {
  const contextGuidance: Record<string, string> = {
    formal: "The text is formal — use polished, professional language appropriate for official documents, letters, or announcements.",
    casual: "The text is casual and conversational — use natural, relaxed language as if speaking to a friend. Use contractions and colloquialisms where appropriate.",
    medical: "The text is medical — preserve all clinical terminology accurately. Use the standard medical vocabulary of the target language.",
    business: "The text is business-oriented — use clear, professional business language appropriate for emails, reports, or presentations.",
  };

  const ctxNote = contextGuidance[context] ?? `The context is: ${context}.`;

  const retryNote =
    attempt > 1
      ? `This is attempt #${attempt}. The user was not satisfied with the previous translation — produce a noticeably different, alternative rendition using varied vocabulary and sentence structure while remaining faithful to the meaning.`
      : "";

  const response = await openai.chat.completions.create({
    model: "gpt-5-mini",
    max_completion_tokens: 2048,
    messages: [
      {
        role: "system",
        content: `You are an expert literary and professional translator.

Translate the following text into ${targetLanguage}.

${ctxNote}
${retryNote}

Translation principles — follow these strictly:
- Translate naturally and fluently, as a native speaker of ${targetLanguage} would write it.
- Preserve the tone, voice, and style of the original (formal stays formal, playful stays playful, etc.).
- Avoid word-for-word translation. Restructure sentences if needed for natural flow.
- Use idiomatic expressions, collocations, and phrasings native to ${targetLanguage}.
- Preserve the original formatting (line breaks, paragraphs, lists, punctuation style).
- Keep proper nouns and brand names as-is unless they have a universally recognized translation.
- Return ONLY the translated text. No explanations, no labels, no "Translation:" prefix.`,
      },
      {
        role: "user",
        content: text,
      },
    ],
  });

  const translated = response.choices[0]?.message?.content?.trim();
  if (!translated) {
    throw new Error("No response from AI");
  }
  return translated;
}

export const LANGUAGE_OPTIONS: Array<{ label: string; code: string }> = [
  { label: "🇬🇧 English", code: "English" },
  { label: "🇩🇪 German", code: "German" },
  { label: "🇷🇺 Russian", code: "Russian" },
  { label: "🇺🇿 Uzbek", code: "Uzbek" },
  { label: "🇫🇷 French", code: "French" },
  { label: "🇪🇸 Spanish", code: "Spanish" },
  { label: "🇸🇦 Arabic", code: "Arabic" },
  { label: "🇹🇷 Turkish", code: "Turkish" },
];
