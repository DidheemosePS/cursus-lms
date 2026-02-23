import Link from "next/link";
import { Status } from "./course-card";

export interface FilterButtonProps {
  label: Status | "all";
  currentStatus?: string;
}

export default async function FilterButton({
  label,
  currentStatus,
}: FilterButtonProps) {
  const href =
    label === "all"
      ? "/learner/my-courses"
      : `/learner/my-courses?progress_status=${label}`;

  return (
    <Link
      href={href}
      className={`flex items-center justify-center px-4 py-2 rounded-lg ${
        currentStatus === label
          ? "bg-[#111318] text-white transition-opacity hover:opacity-90"
          : "bg-white text-[#111318] border border-[#e5e7eb] transition-colors hover:bg-gray-200"
      } text-sm font-medium cursor-pointer`}
    >
      {label.charAt(0).toUpperCase() + label.slice(1).replace(/_/g, " ")}{" "}
    </Link>
  );
}
