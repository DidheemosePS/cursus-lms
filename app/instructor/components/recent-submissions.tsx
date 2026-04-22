import Image from "next/image";
import Link from "next/link";
import Edit from "@/assets/icons/edit.svg";
import type { RecentSubmission } from "@/dal/instructors/dashboard.dal";
import { timeStampStyling } from "@/utils/timestamp-formatter";

const DEFAULT_AVATAR =
  "https://lms-mvp-test.s3.eu-west-1.amazonaws.com/profileImage/avataaars.png";

export function RecentSubmissions({
  submissions,
}: {
  submissions: RecentSubmission[];
}) {
  return (
    <section className="flex flex-col gap-3">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-base font-bold text-[#111318]">
            Recent Submissions
          </p>
          <p className="text-xs text-[#617789] mt-0.5">
            Unreviewed submissions — late ones appear first
          </p>
        </div>
        <Link
          href="/instructor/submissions?status=pending"
          className="text-xs font-bold text-[#135BEC] hover:underline shrink-0"
        >
          View all
        </Link>
      </div>

      {/* Table */}
      <div className="w-full flex flex-col rounded-lg divide-y divide-[#f0f2f4] overflow-hidden shadow-sm">
        {/* Header */}
        <div className="hidden @4xl:grid @4xl:grid-cols-4 gap-4 px-6 py-3 text-xs font-semibold uppercase text-gray-500 tracking-wider bg-gray-200/50">
          <span>Learner</span>
          <span>Course & Module</span>
          <span>Submitted</span>
          <span>Action</span>
        </div>

        {submissions.length === 0 ? (
          <div className="flex items-center justify-center py-12 bg-white text-center">
            <p className="text-sm text-[#617789]">
              No pending submissions. All caught up!
            </p>
          </div>
        ) : (
          submissions.map((s) => {
            const submittedAt = timeStampStyling(s.submittedAt);
            const dueDate = timeStampStyling(s.dueDate);

            return (
              <div
                key={s.id}
                className={`flex flex-col @4xl:grid @4xl:grid-cols-4 gap-4 p-4 @4xl:px-6 @4xl:py-4 items-center transition-colors ${
                  s.isLate ? "bg-red-50/30" : "bg-white"
                } hover:bg-gray-50`}
              >
                {/* Learner */}
                <div className="flex items-center gap-3 w-full">
                  <div className="relative size-9 rounded-full overflow-hidden shrink-0 border border-gray-100">
                    <Image
                      src={s.learner.avatar ?? DEFAULT_AVATAR}
                      alt={s.learner.name}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <p className="text-sm font-bold text-[#111518] truncate">
                      {s.learner.name}
                    </p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {s.isLate && (
                        <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                          {s.lateDays === 1
                            ? "1 day late"
                            : `${s.lateDays} days late`}
                        </span>
                      )}
                      {s.isResubmission && (
                        <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">
                          Resubmission
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Course & Module */}
                <div className="w-full flex flex-col gap-0.5">
                  <p className="text-sm font-medium text-[#111518] truncate">
                    {s.courseTitle}
                  </p>
                  <p className="text-xs text-[#617789] truncate">
                    Module {s.modulePosition} · {s.moduleTitle}
                  </p>
                </div>

                {/* Submitted */}
                <div className="w-full flex flex-col gap-0.5">
                  <p
                    className={`text-xs font-medium ${
                      s.isLate ? "text-red-600" : "text-[#111318]"
                    }`}
                  >
                    {submittedAt.datePart} {submittedAt.timePart}
                  </p>
                  <p className="text-xs text-[#617789]">
                    Due: {dueDate.datePart} {dueDate.timePart}
                  </p>
                </div>

                {/* Action */}
                <div className="w-full">
                  <Link
                    href={`/instructor/submissions/${s.id}`}
                    className="w-full h-9 px-4 rounded-lg bg-[#135BEC] hover:bg-[#135BEC]/90 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Edit className="size-4" />
                    Review
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
