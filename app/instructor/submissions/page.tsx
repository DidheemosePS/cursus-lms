import { Suspense } from "react";
import { getSubmissions } from "@/dal/instructors/submissions.dal";
import SubmissionFilters from "./components/submission-filters";
import { SubmissionTable } from "./components/submission-table";
import { LearnerFooter } from "../my-learners/components/learner-footer";
import type {
  SubmissionStatus,
  SortOption,
  DateFilter,
} from "@/dal/instructors/submissions.dal";

interface PageProps {
  searchParams: Promise<{
    status?: string;
    date?: string;
    courseId?: string;
    attempt?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));

  const { submissions, total, counts, courses, pageSize } =
    await getSubmissions({
      status: params.status as SubmissionStatus | undefined,
      dateFilter: params.date as DateFilter | undefined,
      courseId: params.courseId,
      attempt: params.attempt as "first" | "resubmission" | undefined,
      sort: (params.sort as SortOption) ?? "newest",
      page,
    });

  return (
    <main className="@container min-h-[calc(100dvh-4rem)] flex flex-col gap-6 p-4 md:p-6 lg:p-8 w-full">
      <header className="pt-2">
        <p className="text-2xl font-black text-[#111318]">Submissions</p>
        <p className="text-sm text-gray-500 mt-1">
          View and manage all learner submissions assigned to you.
        </p>
      </header>

      {/* Filters */}
      <Suspense>
        <SubmissionFilters counts={counts} courses={courses} />
      </Suspense>

      {/* Table */}
      <SubmissionTable submissions={submissions} />

      {/* Pagination */}
      <Suspense>
        <LearnerFooter total={total} pageSize={pageSize} currentPage={page} />
      </Suspense>
    </main>
  );
}
