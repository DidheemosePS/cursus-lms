import Link from "next/link";
import Arrow from "@/assets/icons/down-arrow.svg";
import {
  getCourseInfoById,
  getModulesById,
  getInstructorsById,
} from "@/dal/admin/course.dal";
import { Suspense } from "react";
import CourseInfo from "./components/course-info/course-info";
import Modules from "./components/modules/modules";
import Visibility from "./components/visibility/visibility";
import Instructors from "./components/instructors/instructors";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Course ID
  const { slug } = await params;

  // Db Call
  const course = await getCourseInfoById(slug);

  if (!course) {
    return (
      <main className="min-h-[calc(100dvh-4rem)] flex items-center justify-center px-4 py-8 md:px-12">
        <p className="text-gray-500">Course not found.</p>
      </main>
    );
  }

  // Promise passing to child components
  const instructors = getInstructorsById(slug);
  const modules = getModulesById(slug);

  return (
    <main className="@container min-h-[calc(100dvh-4rem)] px-4 py-8 md:px-12 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm mb-6 text-gray-500">
        <Link href="/admin/courses">Courses</Link>
        <Arrow className="size-4 -rotate-90" />
        <span className="font-semibold text-gray-900">
          Introduction to Computer Science
        </span>
      </nav>
      {/* Page Header */}
      <header className="mb-8">
        <p className="text-2xl font-bold tracking-tight text-[#111318]">
          Course Details
        </p>
        <p className="mt-1 text-sm text-[#616f89]">
          Manage course structure, content, and instructors.
        </p>
      </header>

      <section className="flex flex-col @4xl:flex-row items-start gap-8">
        <div className="w-full space-y-8">
          <Suspense fallback={<p>Loading course info...</p>}>
            {/* Course Information */}
            <CourseInfo course={course} />
          </Suspense>
          <Suspense fallback={<p>Loading course modules...</p>}>
            {/* Modules */}
            <Modules modules={modules} />
          </Suspense>
        </div>
        <aside className="w-full @4xl:w-136 space-y-8">
          {/* Visibility */}
          <Visibility
            initialStatus={course.status}
            updatedAt={course.updatedAt}
          />
          <Suspense fallback={<p>Loading course instructors...</p>}>
            {/* Instructors */}
            <Instructors instructors={instructors} />
          </Suspense>
        </aside>
      </section>
    </main>
  );
}
