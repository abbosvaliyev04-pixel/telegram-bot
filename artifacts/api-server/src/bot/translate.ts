import { openai } from "@workspace/integrations-openai-ai-server";

export type TranslationContext = "formal" | "casual" | "medical" | "business";

export async function translateText(
  text: string,
  targetLanguage: string,
  context: TranslationContext | string,
  attempt: number = 1
): Promise<string> {
  const contextGuidance: Record<string, string> = {
    formal:
      "The text is formal — use polished, professional language suited for official documents, letters, or public announcements. Sentences should be structured and authoritative.",
    casual:
      "The text is casual and conversational — write as a native speaker would talk to a friend. Use contractions, colloquialisms, and relaxed phrasing. Prioritize naturalness over formality.",
    medical:
      "The text is medical — preserve all clinical terminology exactly. Use the standard medical vocabulary recognized in the target language. Precision is essential; never paraphrase clinical terms.",
    business:
      "The text is business-oriented — use concise, professional business language appropriate for emails, reports, presentations, or negotiations. Be direct and clear.",
  };

  const ctxNote = contextGuidance[context] ?? `The context is: ${context}.`;

  const retryNote =
    attempt > 1
      ? `This is attempt #${attempt}. The previous translation did not satisfy the user — produce a clearly different version. Use alternative vocabulary, restructure sentences where possible, and vary your phrasing while remaining faithful to the original meaning.`
      : "";

  const response = await openai.chat.completions.create({
    model: "gpt-5-mini",
    max_completion_tokens: 2048,
    messages: [
      {
        role: "system",
        content: `You are a world-class professional translator with native-level mastery of ${targetLanguage}.

Translate the following text into ${targetLanguage}.

${ctxNote}
${retryNote}

Translation rules — follow every one of these without exception:
- Translate for MEANING, not words. Restructure sentences so they sound completely natural in ${targetLanguage}.
- NEVER produce word-for-word translations. If a phrase sounds unnatural in ${targetLanguage}, rephrase it using an equivalent native expression.
- Use idiomatic expressions, natural collocations, and phrasings that a native speaker of ${targetLanguage} would naturally use.
- Preserve the tone, rhythm, and personality of the original: formal stays formal, playful stays playful, urgent stays urgent.
- Maintain proper grammar, punctuation, and typography conventions of ${targetLanguage}.
- Preserve original formatting: line breaks, paragraphs, bullet points, capitalization patterns.
- Keep proper nouns and brand names unchanged unless a well-known official translation exists.
- If the source text is ambiguous, choose the most natural and contextually appropriate interpretation.
- Return ONLY the translated text. No labels, no "Translation:" prefix, no explanations whatsoever.`,
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
