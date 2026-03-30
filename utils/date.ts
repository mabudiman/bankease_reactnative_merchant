/**
 * Format a date string to a readable date string.
 */
export function formatDate(dateString: string, locale?: string): string {
  const date = new Date(dateString);
  const localeTag = locale ?? "en-GB";
  return new Intl.DateTimeFormat(localeTag, {
    dateStyle: "medium",
  }).format(date);
}

export type DateFilter = "all" | "today" | "last7days" | "last30days";

/**
 * Return ISO date strings for a given date filter.
 * Returns null for 'all' (no filtering).
 */
export function getDateRangeForFilter(
  filter: DateFilter
): { dateFrom: string; dateTo: string } | null {
  if (filter === "all") return null;

  const now = new Date();
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  if (filter === "today") {
    return {
      dateFrom: todayStart.toISOString(),
      dateTo: todayEnd.toISOString(),
    };
  }

  const days = filter === "last7days" ? 7 : 30;
  const rangeStart = new Date(todayStart);
  rangeStart.setDate(rangeStart.getDate() - (days - 1));

  return {
    dateFrom: rangeStart.toISOString(),
    dateTo: todayEnd.toISOString(),
  };
}

/**
 * Format a date string for message list display.
 * Returns todayLabel when the date is today, otherwise returns DD/MM (zero-padded).
 */
export function formatMessageDate(isoDate: string, todayLabel: string): string {
  const date = new Date(isoDate);
  const today = new Date();
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();
  if (isToday) return todayLabel;
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}`;
}
