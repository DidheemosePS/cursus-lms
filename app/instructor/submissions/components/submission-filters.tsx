"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import DownArrow from "@/assets/icons/down-arrow.svg";
import School from "@/assets/icons/school.svg";
import History from "@/assets/icons/history.svg";
import Sort from "@/assets/icons/sort.svg";
import type {
  SubmissionCounts,
  SubmissionCourseOption,
} from "@/dal/instructors/submissions.dal";

interface SubmissionFiltersProps {
  counts: SubmissionCounts;
  courses: SubmissionCourseOption[];
}

const TABS = [
  { key: "", label: "All", countKey: "all" },
  { key: "today", label: "Today", countKey: "today" },
  { key: "yesterday", label: "Yesterday", countKey: "yesterday" },
  { key: "pending", label: "Pending", countKey: "pending" },
  { key: "late", label: "Late", countKey: "late" },
  { key: "reviewed", label: "Reviewed", countKey: "reviewed" },
] as const;

export default function SubmissionFilters({
  counts,
  courses,
}: SubmissionFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeTab = searchParams.get("status") ?? "";
  const activeDateFilter = searchParams.get("date") ?? "";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  function handleTabClick(key: string) {
    const params = new URLSearchParams(searchParams);
    // Today/yesterday are date filters, not status filters
    if (key === "today" || key === "yesterday") {
      params.delete("status");
      if (key) params.set("date", key);
      else params.delete("date");
    } else {
      params.delete("date");
      if (key) params.set("status", key);
      else params.delete("status");
    }
    params.set("page", "1");
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  const isTabActive = (key: string) => {
    if (key === "") return !activeTab && !activeDateFilter;
    if (key === "today" || key === "yesterday") return activeDateFilter === key;
    return activeTab === key;
  };

  return (
    <section
      className={`flex flex-col gap-4 bg-white p-4 rounded-lg shadow-sm transition-opacity ${
        isPending ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const count = counts[tab.countKey as keyof SubmissionCounts];
          const isActive = isTabActive(tab.key);
          const isLate = tab.key === "late";
          const isPendingTab = tab.key === "pending";

          return (
            <button
              key={tab.key}
              onClick={() => handleTabClick(tab.key)}
              className={`flex h-9 items-center justify-center px-4 rounded-full text-sm font-medium transition-all active:scale-95 ${
                isActive
                  ? "bg-[#111518] text-white shadow-sm"
                  : "bg-[#f0f2f4] hover:bg-[#e0e2e4] text-[#111518]"
              }`}
            >
              {tab.label}
              {count > 0 && !isActive && (
                <span
                  className={`ml-2 flex h-5 min-w-5 px-1 items-center justify-center rounded-full text-xs font-semibold ${
                    isLate
                      ? "bg-red-100 text-red-600"
                      : isPendingTab
                        ? "bg-[#135BEC]/10 text-[#135BEC]"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <hr className="border-[#f0f2f4]" />

      {/* Dropdowns */}
      <div className="flex flex-col @2xl:flex-row gap-4">
        {/* Course filter */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <School className="size-5 text-gray-400" />
          </div>
          <select
            defaultValue={searchParams.get("courseId") ?? ""}
            onChange={(e) => updateParam("courseId", e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 bg-white rounded-lg text-sm text-[#111518] outline-0 ring ring-[#dbe1e6] focus:ring-2 focus:ring-[#135BEC]/50 appearance-none cursor-pointer"
          >
            <option value="">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.code})
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <DownArrow className="size-5 text-gray-400" />
          </div>
        </div>

        {/* Attempt filter */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <History className="size-5 text-gray-400" />
          </div>
          <select
            defaultValue={searchParams.get("attempt") ?? ""}
            onChange={(e) => updateParam("attempt", e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 bg-white rounded-lg text-sm text-[#111518] outline-0 ring ring-[#dbe1e6] focus:ring-2 focus:ring-[#135BEC]/50 appearance-none cursor-pointer"
          >
            <option value="">All Attempts</option>
            <option value="first">First Attempt</option>
            <option value="resubmission">Resubmissions</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <DownArrow className="size-5 text-gray-400" />
          </div>
        </div>

        {/* Sort */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Sort className="size-5 text-gray-400" />
          </div>
          <select
            defaultValue={searchParams.get("sort") ?? "newest"}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 bg-white rounded-lg text-sm text-[#111518] outline-0 ring ring-[#dbe1e6] focus:ring-2 focus:ring-[#135BEC]/50 appearance-none cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="due_date">Due Date</option>
            <option value="late_first">Late First</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <DownArrow className="size-5 text-gray-400" />
          </div>
        </div>
      </div>
    </section>
  );
}
