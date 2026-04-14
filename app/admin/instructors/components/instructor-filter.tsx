"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition, useRef, useEffect, useState } from "react";
import Search from "@/assets/icons/search.svg";
import type { InstructorCounts } from "@/dal/admin/instructors.dal";

const TABS = [
  { key: "", label: "All", countKey: "all" },
  { key: "active", label: "Active", countKey: "active" },
  {
    key: "pending_invite",
    label: "Pending Invite",
    countKey: "pending_invite",
  },
  { key: "inactive", label: "Inactive", countKey: "inactive" },
] as const;

export default function InstructorFilters({
  counts,
}: {
  counts: InstructorCounts;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") ?? "",
  );

  const searchParamsRef = useRef(searchParams);
  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParamsRef.current.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParamsRef.current.toString());
      if (searchValue) params.set("search", searchValue);
      else params.delete("search");
      params.set("page", "1");
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
      });
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const activeStatus = searchParams.get("status") ?? "";

  return (
    <div
      className={`flex flex-col @3xl:flex-row items-start @3xl:items-center justify-between gap-4 transition-opacity ${
        isPending ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const count = counts[tab.countKey as keyof InstructorCounts];
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

      <div className="flex items-center gap-2 pl-3 rounded-lg overflow-hidden ring ring-gray-200 focus-within:ring-[#135BEC] bg-white shadow-sm w-full @3xl:w-80 transition-shadow">
        <Search className="size-5 text-[#617789] shrink-0" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search by name or email"
          className="flex-1 px-2 py-2.5 text-sm placeholder:text-[#617789] outline-0 text-[#111518]"
        />
      </div>
    </div>
  );
}
