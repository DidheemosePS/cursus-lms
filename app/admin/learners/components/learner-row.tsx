import Image from "next/image";
import type { LearnerListItem } from "@/dal/admin/learners.dal";
import AdminLearnerDrawer from "./learner-drawer";

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

export function AdminLearnerRow({ learner }: { learner: LearnerListItem }) {
  const latestEnrollment = learner.enrollments[0] ?? null;
  const theme =
    statusTheme[learner.status as keyof typeof statusTheme] ??
    statusTheme.inactive;
  const label =
    statusLabel[learner.status as keyof typeof statusLabel] ?? "Unknown";

  return (
    <div className="group flex flex-col @4xl:grid @4xl:grid-cols-5 gap-4 px-6 py-4 items-center bg-white hover:bg-gray-50 transition-colors">
      {/* Learner */}
      <div className="flex items-center gap-3 w-full">
        <div className="relative size-10 rounded-full overflow-hidden shrink-0 border border-gray-100">
          <Image
            src={learner.avatar || DEFAULT_AVATAR}
            alt={learner.name}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <p className="text-sm font-bold text-[#111318] truncate">
            {learner.name}
          </p>
          <p className="text-xs text-[#617789] truncate">{learner.email}</p>
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
      <div className="w-full flex flex-col gap-0.5">
        <p className="text-sm font-medium text-[#111318]">
          {learner._count.enrollments}{" "}
          {learner._count.enrollments === 1 ? "Course" : "Courses"}
        </p>
        {latestEnrollment && (
          <p className="text-xs text-[#617789] truncate">
            Latest: {latestEnrollment.course.title}
          </p>
        )}
      </div>

      {/* Joined */}
      <div className="w-full">
        <p className="text-sm text-[#111318]">
          {formatDate(learner.createdAt)}
        </p>
        {latestEnrollment?.enrolledAt && (
          <p className="text-xs text-[#617789]">
            Enrolled {formatDate(latestEnrollment.enrolledAt)}
          </p>
        )}
      </div>

      {/* Action */}
      <div className="w-full">
        <AdminLearnerDrawer learnerId={learner.id}>
          <button className="w-full h-9 px-4 rounded-lg bg-[#111318] hover:bg-[#111318]/90 text-white text-sm font-semibold transition-colors">
            Manage
          </button>
        </AdminLearnerDrawer>
      </div>
    </div>
  );
}
