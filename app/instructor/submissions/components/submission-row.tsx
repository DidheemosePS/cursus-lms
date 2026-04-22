import Image from "next/image";
import Link from "next/link";
import Edit from "@/assets/icons/edit.svg";
import View from "@/assets/icons/view.svg";
import CircleTick from "@/assets/icons/circle-tick.svg";
import type { SubmissionRow } from "@/dal/instructors/submissions.dal";
import { timeStampStyling } from "@/utils/timestamp-formatter";
import { formatFileSize } from "@/utils/format-file-size";

const DEFAULT_AVATAR =
  "https://lms-mvp-test.s3.eu-west-1.amazonaws.com/profileImage/avataaars.png";

const STATUS_STYLES = {
  pending: {
    row: "bg-white",
    badge: "bg-blue-50 text-blue-700 border-blue-100",
    label: "Pending",
  },
  late: {
    row: "bg-red-50/30",
    badge: "bg-red-50 text-red-700 border-red-100",
    label: "Late",
  },
  reviewed: {
    row: "bg-white",
    badge: "bg-green-50 text-green-700 border-green-100",
    label: "Reviewed",
  },
};

export function SubmissionRow({ submission }: { submission: SubmissionRow }) {
  const theme = STATUS_STYLES[submission.uiStatus];
  const isReviewed = submission.uiStatus === "reviewed";
  const submittedAt = timeStampStyling(submission.submittedAt);
  const dueDate = timeStampStyling(submission.dueDate);

  return (
    <div
      className={`group flex flex-col @5xl:grid @5xl:grid-cols-5 gap-4 p-4 @5xl:px-6 @5xl:py-5 items-center transition-colors ${theme.row} hover:bg-gray-50`}
    >
      {/* Learner */}
      <div className="flex items-center gap-3 w-full">
        <div className="relative size-10 shrink-0">
          <div
            className={`rounded-full overflow-hidden size-10 ${
              isReviewed ? "grayscale" : ""
            }`}
          >
            <Image
              src={submission.learner.avatar ?? DEFAULT_AVATAR}
              alt={submission.learner.name}
              fill
              sizes="40px"
              className="object-cover rounded-full"
            />
          </div>
          {isReviewed && (
            <CircleTick className="size-4 absolute -bottom-0.5 -right-0.5 bg-green-500 text-white rounded-full" />
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <p className="text-[#111518] text-sm font-bold truncate">
            {submission.learner.name}
          </p>
          <p className="text-gray-500 text-xs truncate">
            {submission.courseCode}
          </p>
        </div>
      </div>

      {/* Course & Module */}
      <div className="w-full flex flex-col justify-center gap-1">
        <span className="@5xl:hidden text-xs font-medium text-gray-500">
          Course & Module
        </span>
        <p className="text-[#111518] text-sm font-medium truncate">
          {submission.courseTitle}
        </p>
        <p className="text-gray-500 text-xs truncate">
          Module {submission.modulePosition} · {submission.moduleTitle}
        </p>
      </div>

      {/* Status & Attempt */}
      <div className="w-full flex flex-col justify-center gap-1.5">
        <span className="@5xl:hidden text-xs font-medium text-gray-500">
          Status & Attempt
        </span>
        <span
          className={`inline-flex items-center w-fit px-2.5 py-0.5 rounded-full text-xs font-medium border ${theme.badge}`}
        >
          {theme.label}
        </span>
        <div className="flex items-center gap-1.5">
          {submission.isResubmission ? (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-100">
              Resubmission
            </span>
          ) : (
            <span className="text-xs text-gray-500 font-medium">
              Attempt {submission.attemptNumber}
            </span>
          )}
        </div>
      </div>

      {/* Dates */}
      <div className="w-full flex flex-col justify-center gap-1">
        <span className="@5xl:hidden text-xs font-medium text-gray-500">
          Dates
        </span>
        <div className="flex flex-wrap justify-between @5xl:justify-start gap-x-2">
          <span className="text-xs text-gray-500 w-16 shrink-0">
            Submitted:
          </span>
          <p
            className={`text-xs font-medium ${
              submission.isLate ? "text-red-600" : "text-gray-700"
            }`}
          >
            {submittedAt.datePart} {submittedAt.timePart}
          </p>
        </div>
        <div className="flex flex-wrap justify-between @5xl:justify-start gap-x-2">
          <span className="text-xs text-gray-500 w-16 shrink-0">Due:</span>
          <p
            className={`text-xs ${
              submission.isLate ? "text-gray-500 line-through" : "text-gray-500"
            }`}
          >
            {dueDate.datePart} {dueDate.timePart}
          </p>
        </div>
        {submission.lateDays !== null && (
          <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 w-fit">
            {submission.lateDays === 1
              ? "1 day late"
              : `${submission.lateDays} days late`}
          </span>
        )}
        {/* File info */}
        <div className="flex items-center gap-1 mt-0.5">
          <a
            href={submission.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-[#135BEC] hover:underline truncate max-w-35"
            title={submission.fileName}
          >
            {submission.fileName}
          </a>
          <span className="text-[10px] text-gray-400 shrink-0">
            {formatFileSize(submission.fileSize)}
          </span>
        </div>
      </div>

      {/* Action */}
      <div className="w-full">
        {isReviewed ? (
          <Link
            href={`/instructor/submissions/${submission.id}`}
            className="w-full h-9 px-4 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <View className="size-4" />
            View Review
          </Link>
        ) : (
          <Link
            href={`/instructor/submissions/${submission.id}`}
            className="w-full h-9 px-4 rounded-lg bg-[#135BEC] hover:bg-[#135BEC]/90 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Edit className="size-4" />
            Review Submission
          </Link>
        )}
      </div>
    </div>
  );
}
