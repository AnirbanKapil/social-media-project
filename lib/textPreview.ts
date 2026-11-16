const DEFAULT_MAX_LENGTH = 80;

export function getPreviewText(
  content: string | null | undefined,
  maxLength: number = DEFAULT_MAX_LENGTH,
): string {
  const firstLine = (content ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line.length > 0);

  if (!firstLine) {
    return "Untitled thread";
  }

  if (firstLine.length <= maxLength) {
    return firstLine;
  }

  return `${firstLine.slice(0, maxLength - 1).trimEnd()}…`;
}
