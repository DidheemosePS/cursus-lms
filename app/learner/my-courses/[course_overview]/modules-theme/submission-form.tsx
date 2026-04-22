"use client";
import File from "@/assets/icons/file.svg";
import Warning from "@/assets/icons/warning.svg";
import Close from "@/assets/icons/close.svg";
import CircleTick from "@/assets/icons/circle-tick.svg";
import { handleSubmission } from "./actions";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { validateFile } from "@/lib/s3/s3.utils";
import { useParams } from "next/navigation";

export const ACCEPTED_FILE_TYPES = [".pdf", ".doc", ".docx"] as const;

export default function SubmissionForm({ moduleId }: { moduleId: string }) {
  const { course_overview } = useParams<{ course_overview: string }>();
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmissionInputChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.currentTarget.files;
    if (!files) return;
    setSubmissionFile(files[0]);
    setError(null);
    setSuccess(false);
  }

  function clearFile() {
    setSubmissionFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleOnSubmit(e: FormEvent<HTMLFormElement>) {
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

      // Reset form on success
      setSubmissionFile(null);
      if (inputRef.current) inputRef.current.value = "";
      setSuccess(true);
    } catch (error) {
      if (error instanceof Error)
        setError(error.message || "Something went wrong");
    } finally {
      setIsPending(false);
    }
  }

  // Success state
  if (success) {
    return (
      <div className="shrink-0 w-full ml-auto md:w-auto flex flex-col items-center gap-2 p-4 rounded-lg bg-green-50 border border-green-100 text-center">
        <CircleTick className="size-6 text-green-500" />
        <p className="text-sm font-bold text-green-700">Submitted!</p>
        <p className="text-xs text-green-600">
          Your file has been submitted successfully.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-1 text-xs text-green-700 underline"
        >
          Submit another attempt
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleOnSubmit}
      className="shrink-0 w-full ml-auto md:w-auto flex flex-col items-start gap-2"
    >
      {/* File picker */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg w-full">
        {!submissionFile ? (
          <label
            htmlFor={`submission-file-${moduleId}`}
            className="text-xs font-semibold text-[#616f89] cursor-pointer"
          >
            Choose File
          </label>
        ) : (
          <>
            <span className="text-xs text-[#616f89] truncate flex-1">
              {submissionFile.name}
            </span>
            <button type="button" onClick={clearFile}>
              <Close className="size-3 cursor-pointer text-red-500" />
            </button>
          </>
        )}
      </div>

      {/* Error */}
      {error && (
        <span className="flex items-center gap-1 text-xs text-red-600">
          <Warning className="size-3 shrink-0" />
          <span>{error}</span>
        </span>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        hidden
        id={`submission-file-${moduleId}`}
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
        disabled={!submissionFile || isPending}
        className="w-full px-5 py-2.5 bg-blue-500 transition-colors hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2"
      >
        <File className="size-4" />
        {isPending ? "Submitting…" : "Submit File"}
      </button>
    </form>
  );
}
