import { openai } from "@workspace/integrations-openai-ai-server";

export async function translateText(
  text: string,
  targetLanguage: string
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-5-mini",
    max_completion_tokens: 2048,
    messages: [
      {
        role: "system",
        content: `You are a professional translator. The user will send you text in any language.
Translate it into ${targetLanguage}.

Rules:
- Return ONLY the translated text, nothing else. No explanations, no labels, no "Translation:" prefix.
- Preserve the original formatting (line breaks, paragraphs, punctuation style).
- Keep proper nouns and brand names as-is unless they have a well-known translation.`,
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
