import { timeStampStyling } from "@/utils/timestamp-formatter";

export function getChatDateLabel(date: Date) {
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ] as const;

  const now = new Date();

  // Strip time to compare "Calendar Days"
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfMsg = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  // Difference in full days
  const diffInMs = startOfToday.getTime() - startOfMsg.getTime();
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";

  // If within the last 7 days, show the day name
  if (diffInDays > 1 && diffInDays < 7) {
    return weekDays[date.getDay()];
  }

  // Fallback: e.g., "Oct 28, 2023"
  const { datePart } = timeStampStyling(date);
  return datePart;
}
