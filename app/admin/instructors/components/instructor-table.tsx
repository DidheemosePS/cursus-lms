import type { InstructorListItem } from "@/dal/admin/instructors.dal";
import { InstructorRow } from "./instructors.row";

export function InstructorTable({
  instructors,
}: {
  instructors: InstructorListItem[];
}) {
  if (instructors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-sm text-center">
        <p className="text-sm font-semibold text-[#111318]">
          No instructors found
        </p>
        <p className="mt-1 text-xs text-[#617789]">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="@container w-full flex flex-col rounded-lg divide-y divide-[#f0f2f4] overflow-hidden shadow-sm">
      <div className="hidden @4xl:grid @4xl:grid-cols-5 gap-4 px-6 py-4 text-xs font-semibold uppercase text-gray-500 tracking-wider bg-gray-100">
        <span>Instructor</span>
        <span>Status</span>
        <span>Courses</span>
        <span>Joined</span>
        <span>Action</span>
      </div>
      {instructors.map((instructor) => (
        <InstructorRow key={instructor.id} instructor={instructor} />
      ))}
    </div>
  );
}
