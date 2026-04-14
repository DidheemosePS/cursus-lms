import Group from "@/assets/icons/group.svg";
import CircleTick from "@/assets/icons/circle-tick.svg";
import Warning from "@/assets/icons/warning.svg";
import { EnrollmentSummary } from "@/dal/admin/course.dal";

export default function EnrollmentSummaryCard({
  summary,
}: {
  summary: EnrollmentSummary;
}) {
  return (
    <div className="rounded-lg shadow-sm p-6 bg-white space-y-5">
      {/* Header */}
      <div>
        <p className="text-base font-bold text-[#111318]">Enrollment</p>
        <p className="text-xs text-[#617789] mt-0.5">
          Learner progress overview
        </p>
      </div>

      {/* Completion ring + rate */}
      <div className="flex items-center gap-4">
        <div className="relative size-16 shrink-0">
          <svg className="size-16 -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke="#135BEC"
              strokeWidth="3"
              strokeDasharray={`${summary.completionRate} ${100 - summary.completionRate}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-black text-[#111318]">
              {summary.completionRate}%
            </span>
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-[#111318]">Completion Rate</p>
          <p className="text-xs text-[#617789]">
            {summary.completed} of {summary.totalEnrolled} learners
          </p>
        </div>
      </div>

      <div className="h-px bg-[#f0f2f4]" />

      {/* Stats */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#617789]">
            <div className="size-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Group className="size-3.5" />
            </div>
            <span className="text-xs font-medium">Total Enrolled</span>
          </div>
          <span className="text-sm font-bold text-[#111318]">
            {summary.totalEnrolled}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#617789]">
            <div className="size-7 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
              <CircleTick className="size-3.5" />
            </div>
            <span className="text-xs font-medium">Completed</span>
          </div>
          <span className="text-sm font-bold text-[#111318]">
            {summary.completed}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#617789]">
            <div className="size-7 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
              <Group className="size-3.5" />
            </div>
            <span className="text-xs font-medium">In Progress</span>
          </div>
          <span className="text-sm font-bold text-[#111318]">
            {summary.inProgress}
          </span>
        </div>

        {summary.withLateSubmission > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#617789]">
              <div className="size-7 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                <Warning className="size-3.5" />
              </div>
              <span className="text-xs font-medium">Late Submissions</span>
            </div>
            <span className="text-sm font-bold text-red-600">
              {summary.withLateSubmission}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
