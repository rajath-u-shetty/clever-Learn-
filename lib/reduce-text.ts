const maxChars = 64 * 1_000;

export function reduceText(text: string): string {
  console.log(text.length);
  if (text.length <= maxChars) return text;
  return text.substring(0, maxChars);
}
