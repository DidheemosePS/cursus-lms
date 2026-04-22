"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import Search from "@/assets/icons/search.svg";
import type { CourseCounts } from "@/dal/admin/course.dal";
import { useDebounceCallback } from "@/hooks/use-debounce-callback";

const TABS = [
  { key: "", label: "All", countKey: "all" },
  { key: "active", label: "Active", countKey: "active" },
  { key: "draft", label: "Draft", countKey: "draft" },
  { key: "archived", label: "Archived", countKey: "archived" },
] as const;

export default function CourseFilters({ counts }: { counts: CourseCounts }) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSearch = useDebounceCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }, 300);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }

  const activeStatus = searchParams.get("status") ?? "";

  return (
    <div
      className={`flex flex-col @3xl:flex-row items-start @3xl:items-center justify-between gap-4 transition-opacity ${
        isPending ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      {/* Status tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const count = counts[tab.countKey as keyof CourseCounts];
          const isActive = activeStatus === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => updateParam("status", tab.key)}
              className={`flex h-9 items-center gap-2 px-4 rounded-full text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#111318] text-white shadow-sm"
                  : "bg-white border border-[#e5e7eb] text-[#111318] hover:bg-gray-50"
              }`}
            >
              {tab.label}
              {count > 0 && !isActive && (
                <span className="flex h-5 min-w-5 px-1 items-center justify-center rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 pl-3 rounded-lg overflow-hidden ring ring-gray-200 focus-within:ring-[#135BEC] bg-white shadow-sm w-full @3xl:w-80 transition-shadow">
        <Search className="size-5 text-[#617789] shrink-0" />
        <input
          type="text"
          className="flex-1 px-2 py-2.5 text-sm placeholder:text-[#617789] outline-0 text-[#111518]"
          placeholder="Search by name or code"
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get("search")?.toString()}
        />
      </div>
    </div>
  );
}
