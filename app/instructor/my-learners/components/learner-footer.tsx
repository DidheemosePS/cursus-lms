"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";

interface LearnerFooterProps {
  total: number;
  pageSize: number;
  currentPage: number;
}

export function LearnerFooter({
  total,
  pageSize,
  currentPage,
}: LearnerFooterProps) {
  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const totalPages = Math.ceil(total / pageSize);
  const from = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, total);

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    startTransition(() => {
      push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <footer className="flex items-center justify-between mt-auto px-2">
      <span className="text-sm text-[#617789]">
        Showing{" "}
        <span className="font-medium text-[#111318]">
          {from}-{to}
        </span>{" "}
        of <span className="font-medium text-[#111318]">{total}</span> learners
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1 || isPending}
          className="px-4 py-2 text-sm font-medium text-[#111318] bg-white border border-[#dbe1e6] rounded-lg hover:bg-[#f0f2f4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages || isPending}
          className="px-4 py-2 text-sm font-medium text-[#111318] bg-white border border-[#dbe1e6] rounded-lg hover:bg-[#f0f2f4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </footer>
  );
}
