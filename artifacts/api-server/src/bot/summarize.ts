import { openai } from "@workspace/integrations-openai-ai-server";

export type SummarizeStyle = "formal" | "casual";

export async function summarizeText(
  text: string,
  style: SummarizeStyle,
  attempt: number = 1
): Promise<string> {
  const styleGuidance: Record<SummarizeStyle, string> = {
    formal:
      "Write the summary in a formal, professional tone — clear, precise, and suitable for official documents, reports, or academic contexts. Use complete sentences and structured language.",
    casual:
      "Write the summary in a friendly, conversational tone — as if you're explaining the key points to a colleague in plain, everyday language. Keep it warm and accessible.",
  };

  const retryNote =
    attempt > 1
      ? `This is attempt #${attempt}. The user was not satisfied with the previous summary — produce a noticeably different version: restructure the sentences, vary the phrasing, and emphasize different aspects of the content while staying accurate.`
      : "";

  const response = await openai.chat.completions.create({
    model: "gpt-5-mini",
    max_completion_tokens: 1024,
    messages: [
      {
        role: "system",
        content: `You are an expert editor and summarizer.

The user will send you a text in any language. Summarize it in the SAME language as the original.

Style: ${styleGuidance[style]}
${retryNote}

Summarization principles — follow these strictly:
- Preserve ALL key information: main ideas, important facts, conclusions.
- Cut filler, repetition, and minor details — keep only what matters.
- Write naturally and fluently, as a native speaker would. Never produce robotic or mechanical-sounding text.
- Do NOT translate — always respond in the same language as the input.
- Do NOT begin with phrases like "This text is about..." or "Summary:". Jump straight into the summary.
- Aim for roughly 20–30% of the original length, but prioritize completeness of meaning over strict length limits.
- Return ONLY the summary. No labels, no prefixes, no explanations.`,
      },
      {
        role: "user",
        content: text,
      },
    ],
  });

  const summary = response.choices[0]?.message?.content?.trim();
  if (!summary) {
    throw new Error("No response from AI");
  }
  return summary;
}
