import Link from "next/link";
import { Suspense } from "react";
import Plus from "@/assets/icons/plus.svg";
import Books from "@/assets/icons/books.svg";
import CircleTick from "@/assets/icons/circle-tick.svg";
import Edit from "@/assets/icons/edit.svg";
import Warning from "@/assets/icons/warning.svg";
import { getCourses } from "@/dal/admin/course.dal";
import { CourseCard } from "./components/course-card";
import CourseFilters from "./components/course-filters";
import { LearnerFooter } from "@/app/instructor/my-learners/components/learner-footer";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: "draft" | "active" | "archived";
    page?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));

  const { courses, total, pageSize, counts } = await getCourses({
    search: params.search,
    status: params.status,
    page,
  });

  const statCards = [
    {
      title: "Total Courses",
      value: counts.all,
      icon: (
        <div className="size-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
          <Books className="size-5" />
        </div>
      ),
    },
    {
      title: "Active",
      value: counts.active,
      icon: (
        <div className="size-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
          <CircleTick className="size-5" />
        </div>
      ),
    },
    {
      title: "Draft",
      value: counts.draft,
      icon: (
        <div className="size-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
          <Edit className="size-5" />
        </div>
      ),
    },
    {
      title: "Archived",
      value: counts.archived,
      icon: (
        <div className="size-10 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center">
          <Warning className="size-5" />
        </div>
      ),
    },
  ];

  return (
    <main className="@container min-h-[calc(100dvh-4rem)] px-4 py-8 md:px-12 flex flex-col gap-8">
      {/* Header */}
      <header className="flex flex-col @lg:flex-row @lg:items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-2xl font-bold tracking-tight text-[#111318]">
            Courses
          </p>
          <p className="text-sm text-[#616f89]">
            Manage course content, structure, and instructor assignments.
          </p>
        </div>
        <Link
          href="/admin/courses/new"
          className="flex items-center justify-center gap-2 bg-[#135BEC] hover:bg-[#135BEC]/90 text-white px-5 h-10 rounded-lg shadow-sm transition-colors font-bold text-sm shrink-0"
        >
          <Plus className="size-4" />
          <span>Create Course</span>
        </Link>
      </header>

      {/* Stat cards */}
      <section className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="bg-white p-5 rounded-lg border border-slate-100 shadow-sm flex items-center justify-between hover:border-[#135BEC]/30 transition-colors"
          >
            <div className="space-y-1">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-slate-900">{card.value}</p>
            </div>
            {card.icon}
          </div>
        ))}
      </section>

      {/* Filters */}
      <Suspense>
        <CourseFilters counts={counts} />
      </Suspense>

      {/* Course grid */}
      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-base font-semibold text-[#111318]">
            No courses found
          </p>
          <p className="mt-1 text-sm text-[#616f89]">
            {params.search || params.status
              ? "Try adjusting your search or filters."
              : "Create your first course to get started."}
          </p>
          {!params.search && !params.status && (
            <Link
              href="/admin/courses/new"
              className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#135BEC] text-white text-sm font-bold hover:bg-[#135BEC]/90 transition-colors"
            >
              <Plus className="size-4" />
              Create Course
            </Link>
          )}
        </div>
      ) : (
        <section className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </section>
      )}

      {/* Pagination */}
      <Suspense>
        <LearnerFooter total={total} pageSize={pageSize} currentPage={page} />
      </Suspense>
    </main>
  );
}
