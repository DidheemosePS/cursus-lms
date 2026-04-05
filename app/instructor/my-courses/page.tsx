import Module from "@/assets/icons/module.svg";
import { CourseCard } from "./components/course-card";
import { getMyCourses } from "@/dal/instructors/courses.dal";

// Page
export default async function Page() {
  // Data fetching
  const myCourses = await getMyCourses();

  return (
    <div className="min-h-[calc(100dvh-4rem)] px-4 py-8 md:px-12">
      <header className="mb-8">
        <p className="text-2xl font-bold tracking-tight text-[#111318]">
          My Courses
        </p>
        <p className="mt-1 text-sm text-[#616f89]">
          View the courses assigned to you.
        </p>
      </header>

      {myCourses.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
          {myCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

// Empty state
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="size-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
        <Module className="size-7 text-[#616f89]" />
      </div>
      <p className="text-base font-semibold text-[#111318]">No courses yet</p>
      <p className="mt-1 text-sm text-[#616f89]">
        You have not been assigned to any courses.
      </p>
    </div>
  );
}
