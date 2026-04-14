import Image from "next/image";
import type { InstructorListItem } from "@/dal/admin/instructors.dal";
import InstructorDrawer from "./instructor-drawer";

const DEFAULT_AVATAR =
  "https://lms-mvp-test.s3.eu-west-1.amazonaws.com/profileImage/avataaars.png";

const statusTheme = {
  active: "bg-green-50 text-green-700 border-green-100",
  pending_invite: "bg-amber-50 text-amber-700 border-amber-100",
  inactive: "bg-gray-50 text-gray-500 border-gray-200",
} as const;

const statusLabel = {
  active: "Active",
  pending_invite: "Pending Invite",
  inactive: "Inactive",
} as const;

function formatDate(date: Date | null | undefined) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function InstructorRow({
  instructor,
}: {
  instructor: InstructorListItem;
}) {
  const theme =
    statusTheme[instructor.status as keyof typeof statusTheme] ??
    statusTheme.inactive;
  const label =
    statusLabel[instructor.status as keyof typeof statusLabel] ?? "Unknown";
  const courseCount = instructor._count.instructedCourses;

  return (
    <div className="group flex flex-col @4xl:grid @4xl:grid-cols-5 gap-4 px-6 py-4 items-center bg-white hover:bg-gray-50 transition-colors">
      {/* Instructor */}
      <div className="flex items-center gap-3 w-full">
        <div className="relative size-10 rounded-full overflow-hidden shrink-0 border border-gray-100">
          <Image
            src={instructor.avatar || DEFAULT_AVATAR}
            alt={instructor.name}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <p className="text-sm font-bold text-[#111318] truncate">
            {instructor.name}
          </p>
          <p className="text-xs text-[#617789] truncate">{instructor.email}</p>
        </div>
      </div>

      {/* Status */}
      <div className="w-full">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${theme}`}
        >
          {label}
        </span>
      </div>

      {/* Courses */}
      <div className="w-full">
        <p className="text-sm font-medium text-[#111318]">
          {courseCount} {courseCount === 1 ? "Course" : "Courses"}
        </p>
        {courseCount === 0 && (
          <p className="text-xs text-[#617789]">No courses assigned</p>
        )}
      </div>

      {/* Joined */}
      <div className="w-full">
        <p className="text-sm text-[#111318]">
          {formatDate(instructor.createdAt)}
        </p>
      </div>

      {/* Action */}
      <div className="w-full">
        <InstructorDrawer instructorId={instructor.id}>
          <button className="w-full h-9 px-4 rounded-lg bg-[#111318] hover:bg-[#111318]/90 text-white text-sm font-semibold transition-colors">
            Manage
          </button>
        </InstructorDrawer>
      </div>
    </div>
  );
}
