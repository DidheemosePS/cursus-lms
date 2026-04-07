import { CourseEnrollment } from "@/dal/learners/courses";
import CourseCard from "./course-card";

export default function CourseList({
  courseList,
  activeFilter,
}: {
  courseList: CourseEnrollment[];
  activeFilter?: string;
}) {
  if (courseList.length === 0) {
    const emptyMessages: Record<string, string> = {
      in_progress: "You have no courses in progress.",
      not_started: "You have no courses yet to start.",
      completed: "You haven't completed any courses yet.",
    };
    const message =
      emptyMessages[activeFilter ?? ""] ??
      "You are not enrolled in any courses yet.";

    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-base font-semibold text-[#111318]">
          Nothing here yet
        </p>
        <p className="mt-1 text-sm text-[#616f89]">{message}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
      {courseList.map((enrollment) => (
        <CourseCard key={enrollment.course.id} enrollment={enrollment} />
      ))}
    </div>
  );
}
