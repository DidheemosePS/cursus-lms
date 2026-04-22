import { Suspense } from "react";
import Notice from "@/assets/icons/notice.svg";
import { getLearners } from "@/dal/instructors/learners.dal";
import LearnerFilters from "./components/learner-filters";
import { LearnerTable } from "./components/learner-table";
import { LearnerFooter } from "./components/learner-footer";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    courseId?: string;
    status?: "late" | "pending" | "caught_up";
    page?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));

  const { learners, total, courses, pageSize } = await getLearners({
    search: params.search,
    courseId: params.courseId,
    status: params.status,
    page,
  });

  return (
    <main className="@container min-h-[calc(100dvh-4rem)] flex flex-col gap-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <header className="pt-2">
        <p className="text-2xl font-black text-[#111318]">My Learners</p>
        <p className="text-sm text-gray-500 mt-1">
          View learners assigned to your courses.
        </p>
        <div className="flex items-center gap-2 mt-2 text-sm text-[#617789] bg-white w-fit px-3 py-1.5 rounded-full shadow-sm">
          <Notice className="size-4" />
          <span>Learners are grouped by assigned courses.</span>
        </div>
      </header>

      {/* Filters — client component, reads/writes URL params */}
      <Suspense>
        <LearnerFilters courses={courses} />
      </Suspense>

      {/* Late submission legend */}
      {learners.some((l) => l.lateCount > 0) && (
        <div className="w-max ml-auto flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span className="text-xs font-medium text-[#617789]">
            Highlighted learners have late submissions
          </span>
        </div>
      )}

      {/* Table */}
      <LearnerTable learners={learners} />

      {/* Pagination */}
      <Suspense>
        <LearnerFooter total={total} pageSize={pageSize} currentPage={page} />
      </Suspense>
    </main>
  );
}
