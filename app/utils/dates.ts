/**
 * Format a timestamp as relative time (e.g., "just now", "30m", "4d", "3w")
 * Accepts timestamp in milliseconds (JavaScript native) or seconds (Unix)
 */
export function relative(timestamp: number): string {
  const now = new Date();
  // Handle both milliseconds and seconds
  const dateMs = timestamp > 9999999999 ? timestamp : timestamp * 1000;
  const date = new Date(dateMs);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${diffYears}y ago`;
}

/**
 * Format a timestamp as full date with time (e.g., "Nov 22, 2025, 07:00 PM EST")
 * Accepts timestamp in milliseconds (JavaScript native) or seconds (Unix)
 */
export function full(timestamp: number): string {
  // Handle both milliseconds and seconds
  const dateMs = timestamp > 9999999999 ? timestamp : timestamp * 1000;
  const date = new Date(dateMs);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

/**
 * Format a timestamp as date only (e.g., "November 22, 2025")
 * Accepts timestamp in milliseconds (JavaScript native) or seconds (Unix)
 */
export function dateOnly(timestamp: number): string {
  // Handle both milliseconds and seconds
  const dateMs = timestamp > 9999999999 ? timestamp : timestamp * 1000;
  const date = new Date(dateMs);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format a timestamp for HTML datetime-local input (YYYY-MM-DDTHH:mm)
 * Accepts timestamp in seconds (Unix timestamp)
 */
export function formatDateTimeForInput(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toISOString().slice(0, 16);
}

/**
 * Format a timestamp for HTML date input (YYYY-MM-DD)
 * Accepts timestamp in seconds (Unix timestamp)
 */
export function formatDateForInput(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toISOString().split("T")[0];
}

/**
 * Parse a date string (YYYY-MM-DD) to Unix timestamp in seconds
 */
export function parseDate(dateString: string): number {
  // Create date at noon UTC to avoid timezone issues
  const [year, month, day] = dateString.split("-");
  const date = new Date(`${year}-${month}-${day}T12:00:00Z`);
  return Math.floor(date.getTime() / 1000);
}

/**
 * Parse a datetime string (YYYY-MM-DDTHH:mm) to Unix timestamp in seconds
 */
export function parseDateTime(dateTimeString: string): number {
  // Parse ISO datetime format (YYYY-MM-DDTHH:mm)
  const date = new Date(`${dateTimeString}:00Z`);
  return Math.floor(date.getTime() / 1000);
}
