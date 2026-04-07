import Link from "next/link";
import { Status } from "./course-card";

export interface FilterButtonProps {
  label: Status | "all";
  currentStatus?: string;
}

const LABELS: Record<Status | "all", string> = {
  all: "All",
  in_progress: "In Progress",
  not_started: "Not Started",
  completed: "Completed",
};

export default function FilterButton({
  label,
  currentStatus,
}: FilterButtonProps) {
  const href =
    label === "all"
      ? "/learner/my-courses"
      : `/learner/my-courses?progress_status=${label}`;

  // "all" is active when no status param is set
  const isActive = label === "all" ? !currentStatus : currentStatus === label;

  return (
    <Link
      href={href}
      className={`flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        isActive
          ? "bg-[#111318] text-white hover:opacity-90"
          : "bg-white text-[#111318] border border-[#e5e7eb] hover:bg-gray-100"
      }`}
    >
      {LABELS[label]}
    </Link>
  );
}
