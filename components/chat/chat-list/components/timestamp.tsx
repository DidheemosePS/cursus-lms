import { timeStampStyling } from "@/utils/timestamp-formatter";

export function Timestamp({ date }: { date: Date | string | null }) {
  if (!date) return null;
  const { timePart } = timeStampStyling(date);
  return (
    <span className="text-[10px] font-medium text-[#616f89] whitespace-nowrap leading-none">
      {timePart}
    </span>
  );
}
