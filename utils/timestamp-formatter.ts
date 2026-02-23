// To style like this 7 days ago, in 5 days etc.

type Limit = "second" | "minute" | "hour" | "day" | "week" | "month";

export function formatTimeAgo(date: Date, limit?: Limit) {
  const formatter = new Intl.RelativeTimeFormat(undefined, {
    numeric: "auto",
  });

  const DIVISIONS: { amount: number; name: Intl.RelativeTimeFormatUnit }[] = [
    { amount: 60, name: "second" },
    { amount: 60, name: "minute" },
    { amount: 24, name: "hour" },
    { amount: 7, name: "day" },
    { amount: 4.34524, name: "week" },
    { amount: 12, name: "month" },
    { amount: Number.POSITIVE_INFINITY, name: "year" },
  ] as const;

  const divisions = limit
    ? DIVISIONS.slice(0, DIVISIONS.findIndex((d) => d.name === limit) + 1)
    : DIVISIONS;

  let duration = (new Date(date).getTime() - new Date().getTime()) / 1000;

  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.name);
    }
    duration /= division.amount;
  }
}

//  To style like this Oct 28, 2023 02:15 PM
export function timeStampStyling(timeStamp: Date | string) {
  const d = new Date(timeStamp);

  const datePart = d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const timePart = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h24",
  });

  return { datePart, timePart };
}
