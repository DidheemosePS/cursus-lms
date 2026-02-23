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
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { updateSubmission } from "./action";
import { validateFile } from "@/lib/s3/s3.utils";
import { useParams } from "next/navigation";

const colors = {
  submitted: "bg-blue-100 text-blue-500",
  reviewed: "bg-green-100 text-green-500",
  resubmit: "bg-orange-100 text-orange-500",
} as const;

export default function SubmissionHistoryCard({
  stage,
  submission,
  error,
  setError,
}: {
  stage: keyof typeof colors;
  submission: Submission;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
}) {
  const { course_overview } = useParams<{ course_overview: string }>();

  const stageTheme = colors[stage] ?? "bg-gray-100 text-gray-500";

  const { datePart, timePart } = timeStampStyling(submission.updatedAt); //  To style like this Oct 28, 2023 02:15 PM

  const downloadSize = formatFileSize(submission.fileSize);

  const [isPending, setIsPending] = useState(false);

  async function handleUpdateSubmission(
    event: ChangeEvent<HTMLInputElement>,
    submissionId: string,
    previousUrl: string,
  ) {
    try {
      const files = event.currentTarget.files;
      if (!files) throw new Error("No file selected");
      if (!submissionId) throw new Error("Submission ID missing");
      if (!previousUrl) throw new Error("File url missing");

      setIsPending(true);

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

      // Toast
      console.log(actionRes);
    } catch (error) {
      if (error instanceof Error)
        setError(error.message || "Something went wrong");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="group flex items-start gap-4 p-4 rounded-xl border border-gray-500/20 hover:shadow-md transition-all">
      <div
        className={`size-10 rounded-full ${stageTheme} flex items-center justify-center`}
      >
        <Tick className="size-5" />
      </div>
      <div className="flex-1">
        <p className="font-bold">Attempt {submission.attemptNumber}</p>
        <div className="text-sm text-[#616f89] mb-3 flex items-center gap-1">
          <Calendar className="size-4" />
          <span>
            Submitted on {datePart} • {timePart}
          </span>
        </div>
        <div className="flex gap-4">
          <Link
            href={submission.fileUrl}
            target="_blank"
            className="shrink-0 flex items-center gap-2 text-gray-500 cursor-pointer hover:underline"
          >
            <Eye className="size-4.5" />
            <span className="text-xs">Preview</span>
          </Link>
          <a
            href={submission.fileUrl}
            download
            target="_blank"
            className="shrink-0 flex items-center gap-2 text-gray-500 cursor-pointer hover:underline"
          >
            <Download className="size-4.5" />
            <span className="text-xs">Download ({downloadSize})</span>
          </a>
          {submission.status === "submitted" && (
            <>
              <label
                htmlFor={submission.id}
                className={`shrink-0 px-2.5 py-1 ${stageTheme} rounded-lg flex items-center gap-2 ${isPending ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:underline"}`}
              >
                <File className="size-4.5" />
                <span className="text-sm font-bold">Update Submission</span>
              </label>
              <input
                hidden
                id={submission.id}
                type="file"
                accept={ACCEPTED_FILE_TYPES.join(",")}
                name="update-submission-file"
                onChange={(e) =>
                  handleUpdateSubmission(e, submission.id, submission.fileUrl)
                }
                disabled={isPending}
              />
            </>
          )}
        </div>
        {error && (
          <span className="flex items-center gap-1 text-xs text-red-600 mt-1">
            <Warning className="size-3 shrink-0" />
            <span>{error}</span>
          </span>
        )}
      </div>
      <span
        className={`px-2.5 py-1 rounded-lg text-xs font-bold ${stageTheme}`}
      >
        {submission.status
          ? submission.status.charAt(0).toUpperCase() +
            submission.status.slice(1)
          : ""}
      </span>
    </div>
  );
}
