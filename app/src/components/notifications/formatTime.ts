const RELATIVE_UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ["year", 365 * 24 * 60 * 60],
  ["month", 30 * 24 * 60 * 60],
  ["week", 7 * 24 * 60 * 60],
  ["day", 24 * 60 * 60],
  ["hour", 60 * 60],
  ["minute", 60],
];

export function toDate(value: string): Date {
  const numeric = Number(value);
  return Number.isNaN(numeric) ? new Date(value) : new Date(numeric);
}

export function formatRelativeTime(value: string): string {
  const date = toDate(value);
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));

  if (seconds < 30) {
    return "just now";
  }

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const [unit, unitSeconds] of RELATIVE_UNITS) {
    if (seconds >= unitSeconds) {
      return formatter.format(-Math.floor(seconds / unitSeconds), unit);
    }
  }

  return formatter.format(-seconds, "second");
}
