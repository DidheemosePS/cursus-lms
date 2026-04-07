"use client";
import Tick from "@/assets/icons/circle-tick.svg";
import Calendar from "@/assets/icons/calendar-check.svg";
import Download from "@/assets/icons/download.svg";
import Eye from "@/assets/icons/eye.svg";
import File from "@/assets/icons/file.svg";
import Warning from "@/assets/icons/warning.svg";
import { Submission } from "../page";
import Link from "next/link";
import { timeStampStyling } from "@/utils/timestamp-formatter";
import { formatFileSize } from "@/utils/format-file-size";
import { ACCEPTED_FILE_TYPES } from "../modules-theme/submission-form";
import { ChangeEvent, useState } from "react";
import { updateSubmission } from "./action";
import { validateFile } from "@/lib/s3/s3.utils";
import { useParams } from "next/navigation";

const colors = {
  submitted: "bg-blue-100 text-blue-500",
  reviewed: "bg-green-100 text-green-500",
} as const;

export default function SubmissionHistoryCard({
  submission,
}: {
  submission: Submission;
}) {
  const { course_overview } = useParams<{ course_overview: string }>();
  const stageTheme =
    colors[submission.status as keyof typeof colors] ??
    "bg-gray-100 text-gray-500";
  const { datePart, timePart } = timeStampStyling(submission.updatedAt);
  const downloadSize = formatFileSize(submission.fileSize);

  // Each card owns its own state — no shared error prop
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleUpdateSubmission(
    event: ChangeEvent<HTMLInputElement>,
    submissionId: string,
    previousUrl: string,
  ) {
    try {
      const files = event.currentTarget.files;
      if (!files || files.length === 0) throw new Error("No file selected");
      if (!submissionId) throw new Error("Submission ID missing");
      if (!previousUrl) throw new Error("File url missing");

      setIsPending(true);
      setError(null);

      const fileValidation = validateFile(files[0]);
      if (!fileValidation.valid)
        throw new Error(fileValidation.error || "Invalid file");

      const actionRes = await updateSubmission(
        files[0],
        submissionId,
        previousUrl,
        course_overview,
      );

      if (!actionRes.success)
        throw new Error(actionRes.message || "File submission failed");

      setSuccess(true);
    } catch (err) {
      if (err instanceof Error) setError(err.message || "Something went wrong");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 hover:shadow-sm transition-all">
      {/* Status icon */}
      <div
        className={`size-10 rounded-full ${stageTheme} flex items-center justify-center shrink-0`}
      >
        <Tick className="size-5" />
      </div>

      <div className="flex-1 min-w-0">
        {/* Attempt + date */}
        <p className="font-bold text-[#111318] text-sm">
          Attempt {submission.attemptNumber}
        </p>
        <div className="text-xs text-[#616f89] mb-2 flex items-center gap-1.5">
          <Calendar className="size-3.5 shrink-0" />
          <span>
            Submitted on {datePart} · {timePart}
          </span>
        </div>

        {/* File name */}
        {submission.fileName && (
          <p className="text-xs text-[#617789] truncate mb-2">
            {submission.fileName}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-4 items-center">
          <Link
            href={submission.fileUrl}
            target="_blank"
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:underline"
          >
            <Eye className="size-4" />
            Preview
          </Link>

          <a
            href={submission.fileUrl}
            download
            target="_blank"
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:underline"
          >
            <Download className="size-4" />
            Download ({downloadSize})
          </a>

          {/* Update — only on submitted, not reviewed, not after success */}
          {submission.status === "submitted" && !success && (
            <>
              <label
                htmlFor={`update-${submission.id}`}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${stageTheme} ${
                  isPending
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:opacity-80"
                }`}
              >
                <File className="size-3.5" />
                Update Submission
              </label>
              <input
                hidden
                id={`update-${submission.id}`}
                type="file"
                accept={ACCEPTED_FILE_TYPES.join(",")}
                onChange={(e) =>
                  handleUpdateSubmission(e, submission.id, submission.fileUrl)
                }
                disabled={isPending}
              />
            </>
          )}

          {success && (
            <span className="text-xs font-bold text-green-600">
              ✓ Updated successfully
            </span>
          )}
        </div>

        {/* Error — isolated to this card only */}
        {error && (
          <span className="flex items-center gap-1 text-xs text-red-600 mt-2">
            <Warning className="size-3 shrink-0" />
            {error}
          </span>
        )}
      </div>

      {/* Status badge */}
      <span
        className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 ${stageTheme}`}
      >
        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
      </span>
    </div>
  );
}
