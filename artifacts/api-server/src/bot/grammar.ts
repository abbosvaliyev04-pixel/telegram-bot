import { openai } from "@workspace/integrations-openai-ai-server";

export async function checkGrammar(text: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-5-mini",
    max_completion_tokens: 2048,
    messages: [
      {
        role: "system",
        content: `You are a grammar and spelling assistant. The user will send you text in any language (English, German, Russian, Uzbek, or others). 
Detect the language automatically and return the corrected version with all grammar and spelling mistakes fixed.

Rules:
- Return ONLY the corrected text, nothing else. No explanations, no labels, no "Corrected:" prefix.
- If the text has no errors, return it unchanged.
- Preserve the original formatting (line breaks, paragraphs, etc).
- Do not translate — keep the same language as the input.`,
      },
      {
        role: "user",
        content: text,
      },
    ],
  });

  const corrected = response.choices[0]?.message?.content?.trim();
  if (!corrected) {
    throw new Error("No response from AI");
  }
  return corrected;
}
