import { filterCourses } from "@/dal/learners/courses";
import { Status } from "./components/course-card";
import CourseList from "./components/course-list";
import FilterButton from "./components/filter-button";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ progress_status?: Status }>;
}) {
  const { progress_status } = await searchParams;

  const courses = await filterCourses(progress_status);

  return (
    <div className="min-h-[calc(100dvh-4rem)] px-4 py-8 md:px-12 space-y-8">
      <header className="flex flex-wrap justify-between items-end gap-4">
        <div className="space-y-1">
          <p className="text-2xl font-bold tracking-tight text-[#111318]">
            My Courses
          </p>
          <p className="text-sm text-[#616f89]">
            Manage your enrolled courses and track progress
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterButton label="all" currentStatus={progress_status} />
          <FilterButton label="in_progress" currentStatus={progress_status} />
          <FilterButton label="not_started" currentStatus={progress_status} />
          <FilterButton label="completed" currentStatus={progress_status} />
        </div>
      </header>

      <CourseList courseList={courses} activeFilter={progress_status} />
    </div>
  );
}
