"use client";

import File from "@/assets/icons/file.svg";
import Warning from "@/assets/icons/warning.svg";
import Close from "@/assets/icons/close.svg";

import { handleSubmission } from "./actions";
import { ChangeEvent, FormEvent, useState } from "react";
import { validateFile } from "@/lib/s3/s3.utils";
import { useParams } from "next/navigation";

export const ACCEPTED_FILE_TYPES = [".pdf", ".doc", ".docx"] as const;

export default function SubmissionForm({ moduleId }: { moduleId: string }) {
  const { course_overview } = useParams<{ course_overview: string }>();

  const [submissionFile, setSubmissionFile] = useState<File | null>();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>();

  function handleSubmissionInputChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.currentTarget.files;
    if (!files) return;
    setSubmissionFile(files[0]);
    setError(null);
  }

  async function handleOnSubmit(e: FormEvent<HTMLFormElement>) {
    // Prevent reload
    e.preventDefault();
    try {
      if (!submissionFile) throw new Error("No file selected");

      setIsPending(true);

      const fileValidation = validateFile(submissionFile);

      if (!fileValidation.valid)
        throw new Error(fileValidation.error || "Invalid file");

      const actionRes = await handleSubmission(
        submissionFile,
        course_overview,
        moduleId,
      );

      if (!actionRes.success)
        throw new Error(actionRes.message || "File submission failed");

      // Toast
    } catch (error) {
      if (error instanceof Error)
        setError(error.message || "Something went wrong");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form
      onSubmit={handleOnSubmit}
      className="shrink-0 w-full ml-auto md:w-auto flex flex-col items-start gap-2"
    >
      <div className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-lg">
        {!submissionFile && (
          <label
            htmlFor="submission-file"
            className="text-xs font-semibold text-[#616f89] cursor-pointer"
          >
            Choose File
          </label>
        )}
        {submissionFile && (
          <>
            <span className="text-xs text-[#616f89]">
              {submissionFile.name}
            </span>
            <button
              onClick={() => {
                setSubmissionFile(null);
                setError(null);
              }}
            >
              <Close className="size-3 cursor-pointer text-red-600" />
            </button>
          </>
        )}
      </div>
      {error && (
        <span className="flex items-center gap-1 text-xs text-red-600">
          <Warning className="size-3 shrink-0" />
          <span>{error}</span>
        </span>
      )}
      <input
        hidden
        id="submission-file"
        type="file"
        accept={ACCEPTED_FILE_TYPES.join(",")}
        name="submission-file"
        onChange={handleSubmissionInputChange}
      />
      <span className="text-[10px] text-[#616f89]">
        PDF, DOC, DOCX allowed. Max size 5 MB.
      </span>
      <button
        type="submit"
        disabled={!submissionFile ? true : false || isPending}
        className="w-full px-5 py-2.5 bg-blue-500 transition-colors not-disabled:hover:bg-blue-600 text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <File className="size-4" />
        {isPending ? "Submitting..." : "Submit File"}
      </button>
    </form>
  );
}
