import Link from "next/link";
import Arrow from "@/assets/icons/down-arrow.svg";
import { redirect } from "next/navigation";
import {
  getCourseInfoById,
  getModulesById,
  getInstructorsById,
  getCourseEnrollmentSummary,
} from "@/dal/admin/course.dal";
import { Suspense } from "react";
import CourseInfo from "./components/course-info/course-info";
import Modules from "./components/modules/modules";
import Visibility from "./components/visibility/visibility";
import Instructors from "./components/instructors/instructors";
import EnrollmentSummaryCard from "./components/enrollment-summary-card";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const course = await getCourseInfoById(slug);

  if (!course) redirect("/admin/courses");

  // Don't await modules and instructors — pass promises directly
  const instructorsPromise = getInstructorsById(slug);
  const modulesPromise = getModulesById(slug);

  // Await only what server components need synchronously
  const enrollmentSummary = await getCourseEnrollmentSummary(slug);

  return (
    <main className="@container min-h-[calc(100dvh-4rem)] px-4 py-8 md:px-12 space-y-8">
      {/* Breadcrumb — fixed to use actual course title */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link
          href="/admin/courses"
          className="hover:text-[#111318] transition-colors"
        >
          Courses
        </Link>
        <Arrow className="size-4 -rotate-90 shrink-0" />
        <span className="font-semibold text-gray-900 truncate">
          {course.title}
        </span>
      </nav>

      {/* Page header */}
      <header>
        <p className="text-2xl font-bold tracking-tight text-[#111318]">
          Course Details
        </p>
        <p className="mt-1 text-sm text-[#616f89]">
          Manage course structure, content, and instructors.
        </p>
      </header>

      {/* Two column layout */}
      <section className="flex flex-col @4xl:flex-row items-start gap-8">
        {/* Left — main content */}
        <div className="w-full space-y-8 min-w-0">
          <Suspense fallback={<SectionSkeleton />}>
            <CourseInfo course={course} />
          </Suspense>

          <Suspense fallback={<SectionSkeleton />}>
            <Modules modules={modulesPromise} />
          </Suspense>
        </div>

        {/* Right — sidebar */}
        <aside className="w-full @4xl:w-136 shrink-0 space-y-6">
          <Visibility
            initialStatus={course.status}
            updatedAt={course.updatedAt}
          />

          {/* Enrollment summary — new */}
          <EnrollmentSummaryCard summary={enrollmentSummary} />

          <Suspense fallback={<SectionSkeleton />}>
            <Instructors instructors={instructorsPromise} />
          </Suspense>
        </aside>
      </section>
    </main>
  );
}

function SectionSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
      <div className="h-4 bg-gray-100 rounded w-32 mb-4" />
      <div className="space-y-3">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-3/4" />
      </div>
    </div>
  );
}
