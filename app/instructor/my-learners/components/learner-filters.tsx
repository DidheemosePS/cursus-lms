"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import Search from "@/assets/icons/search.svg";
import DownArrow from "@/assets/icons/down-arrow.svg";
import { CourseOption } from "@/dal/instructors/learners.dal";
import { useDebounceCallback } from "@/hooks/use-debounce-callback";

interface LearnerFiltersProps {
  courses: CourseOption[];
}

export default function LearnerFilters({ courses }: LearnerFiltersProps) {
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

  return (
    <section
      className={`flex flex-col @2xl:flex-row gap-4 bg-white rounded-lg shadow-sm p-4 mb-4 transition-opacity ${
        isPending ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      {/* Search */}
      <div className="flex flex-1 flex-col gap-1.5">
        <label className="text-sm font-medium text-[#111518]">Search</label>
        <div className="flex items-center rounded-lg h-10 bg-[#f0f2f4] overflow-hidden focus-within:ring-2 focus-within:ring-[#135BEC]/50 transition-shadow">
          <div className="pl-2 text-[#617789]">
            <Search className="size-5" />
          </div>
          <input
            type="text"
            className="px-1 placeholder:text-[#617789] placeholder:text-sm outline-0 text-[#111518] w-full h-full text-sm"
            placeholder="Search by learner name"
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={searchParams.get("search")?.toString()}
          />
        </div>
      </div>

      {/* Filter by Course */}
      <div className="flex flex-1 flex-col gap-1.5">
        <label className="text-sm font-medium text-[#111318]">
          Filter by Course
        </label>
        <div className="relative h-10">
          <select
            defaultValue={searchParams.get("courseId") ?? ""}
            onChange={(e) => updateParam("courseId", e.target.value)}
            className="w-full h-full px-4 pr-10 bg-white rounded-lg text-sm text-[#111518] outline-0 ring ring-[#dbe1e6] focus:ring-2 focus:ring-[#135BEC]/50 appearance-none cursor-pointer"
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
      </div>

      {/* Filter by Status */}
      <div className="flex flex-1 flex-col gap-1.5">
        <label className="text-sm font-medium text-[#111318]">
          Filter by Status
        </label>
        <div className="relative h-10">
          <select
            defaultValue={searchParams.get("status") ?? ""}
            onChange={(e) => updateParam("status", e.target.value)}
            className="w-full h-full px-4 pr-10 bg-white rounded-lg text-sm text-[#111518] outline-0 ring ring-[#dbe1e6] focus:ring-2 focus:ring-[#135BEC]/50 appearance-none cursor-pointer"
          >
            <option value="">All Learners</option>
            <option value="late">Late submission</option>
            <option value="pending">Pending submission</option>
            <option value="caught_up">All caught up</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <DownArrow className="size-5 text-gray-400" />
          </div>
        </div>
      </div>
    </section>
  );
}
