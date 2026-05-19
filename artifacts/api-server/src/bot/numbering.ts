export function numberList(text: string): string {
  const lines = text.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);

  let items: string[];

  if (lines.length > 1) {
    items = lines;
  } else {
    items = text
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  if (items.length === 0) {
    return "Please send me a list of items to number them.";
  }

  return items.map((item, i) => `${i + 1}. ${item}`).join("\n");
}
