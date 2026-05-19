export function numberList(text: string): string {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return "Please send me a list of items (one per line) to number them.";
  }

  return lines.map((line, i) => `${i + 1}. ${line}`).join("\n");
}
