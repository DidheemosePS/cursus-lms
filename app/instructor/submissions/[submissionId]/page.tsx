import Link from "next/link";
import { notFound } from "next/navigation";
import LeftArrow from "@/assets/icons/left-arrow.svg";
import { getSubmissionDetail } from "@/dal/instructors/submission-review.dal";
import { LearnerCard } from "./components/learner-card";
import { PreviousAttempts } from "./components/previous-attempts";
import { FeedbackSection } from "./components/feedback-section";
import { timeStampStyling } from "@/utils/timestamp-formatter";
import { formatFileSize } from "@/utils/format-file-size";

export default async function Page({
  params,
}: {
  params: Promise<{ submissionId: string }>;
}) {
  const { submissionId } = await params;
  const submission = await getSubmissionDetail(submissionId);

  if (!submission) notFound();

  const isReviewed = submission.status === "reviewed";

  const submittedAt = timeStampStyling(submission.submittedAt);
  const dueDate = timeStampStyling(submission.dueDate);

  return (
    <main className="@container min-h-[calc(100dvh-4rem)] p-4 md:p-6 lg:p-8 w-full">
      {/* Top bar — back + next */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/instructor/submissions"
          className="flex items-center gap-1.5 text-sm font-medium text-[#617789] hover:text-[#111318] transition-colors"
        >
          <LeftArrow className="size-4" />
          Back to Submissions
        </Link>

        {submission.nextSubmissionId && (
          <Link
            href={`/instructor/submissions/${submission.nextSubmissionId}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#135BEC] hover:bg-[#135BEC]/90 text-white text-sm font-bold transition-colors shadow-sm"
          >
            Next Pending
            <LeftArrow className="size-4 rotate-180" />
          </Link>
        )}
      </div>

      {/* Two column layout */}
      <div className="flex flex-col @4xl:flex-row gap-6 items-start">
        {/* ── Left column ── */}
        <div className="flex flex-col gap-6 flex-1 w-full">
          {/* Submission header card */}
          <div className="rounded-xl border border-[#f0f2f4] bg-white p-6 shadow-sm">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-[#617789] mb-4 flex-wrap">
              <span>{submission.courseTitle}</span>
              <span>·</span>
              <span>
                Module {submission.modulePosition} · {submission.moduleTitle}
              </span>
            </div>

            {/* Learner name + badges */}
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <p className="text-xl font-black text-[#111318]">
                  {submission.learner.name}
                </p>
                <p className="text-sm text-[#617789] mt-0.5">
                  {submission.courseTitle}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {submission.isResubmission && (
                  <span className="text-xs font-bold text-orange-700 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full">
                    Resubmission · Attempt {submission.attemptNumber}
                  </span>
                )}
                {!submission.isResubmission && (
                  <span className="text-xs font-medium text-[#617789] bg-gray-100 px-2.5 py-1 rounded-full">
                    Attempt {submission.attemptNumber}
                  </span>
                )}
                {submission.isLate && (
                  <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
                    {submission.lateDays === 1
                      ? "1 day late"
                      : `${submission.lateDays} days late`}
                  </span>
                )}
                {isReviewed && (
                  <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
                    Reviewed
                  </span>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-[#f0f2f4]">
              <div>
                <p className="text-[10px] font-bold text-[#617789] uppercase tracking-wider mb-1">
                  Submitted
                </p>
                <p
                  className={`text-sm font-medium ${
                    submission.isLate ? "text-red-600" : "text-[#111318]"
                  }`}
                >
                  {submittedAt.datePart} {submittedAt.timePart}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#617789] uppercase tracking-wider mb-1">
                  Due Date
                </p>
                <p
                  className={`text-sm font-medium ${
                    submission.isLate
                      ? "text-gray-400 line-through"
                      : "text-[#111318]"
                  }`}
                >
                  {dueDate.datePart} {dueDate.timePart}
                </p>
              </div>
            </div>
          </div>

          {/* File section */}
          <div className="rounded-xl border border-[#f0f2f4] bg-white p-6 shadow-sm">
            <p className="text-base font-bold text-[#111318] mb-4">
              Submitted File
            </p>
            <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-[#f0f2f4]">
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-semibold text-[#111318] truncate">
                  {submission.fileName}
                </p>
                <p className="text-xs text-[#617789] mt-0.5">
                  {formatFileSize(submission.fileSize)}
                </p>
              </div>
              <a
                href={submission.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-[#135BEC] hover:bg-[#135BEC]/90 text-white text-sm font-semibold transition-colors shadow-sm"
              >
                Open File
              </a>
            </div>
          </div>

          {/* Feedback */}
          <FeedbackSection
            submissionId={submission.id}
            feedback={submission.feedback}
          />
        </div>

        {/* ── Right column ── */}
        <div className="flex flex-col gap-4 w-full @4xl:w-80 shrink-0">
          <LearnerCard
            learner={submission.learner}
            courseTitle={submission.courseTitle}
            totalModules={submission.totalModules}
          />
          <PreviousAttempts attempts={submission.previousAttempts} />
        </div>
      </div>
    </main>
  );
}
