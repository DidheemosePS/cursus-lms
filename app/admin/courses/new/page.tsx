"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import Arrow from "@/assets/icons/down-arrow.svg";

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

const MAX_FILE_SIZE = 5242880; // 5MB in bytes

export default function Page() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"draft" | "active">("draft");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = useCallback((file: File | null) => {
    if (!file) return;
    setError(null);

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Invalid file type. Please use PNG, JPEG, or WebP.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds 5MB limit.");
      return;
    }

    setCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));
  }, []);

  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    handleImageChange(e.dataTransfer.files[0] ?? null);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("status", status);
    if (coverImage) formData.set("coverImage", coverImage);

    startTransition(async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/admin/courses`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Something went wrong");
        return;
      }

      router.push(`/admin/courses/${data.courseId}`);
    });
  }

  return (
    <main className="@container min-h-[calc(100dvh-4rem)] px-4 py-8 md:px-12 max-w-3xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link
          href="/admin/courses"
          className="hover:text-[#111318] transition-colors"
        >
          Courses
        </Link>
        <Arrow className="size-4 -rotate-90 shrink-0" />
        <span className="font-semibold text-gray-900">New Course</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <p className="text-2xl font-bold tracking-tight text-[#111318]">
          Create Course
        </p>
        <p className="mt-1 text-sm text-[#616f89]">
          Set up the basics. You can add modules and assign instructors after
          creation.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Cover image */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#111318]">
            Cover Image
            <span className="ml-1 text-[#617789] font-normal">(optional)</span>
          </label>

          {coverPreview ? (
            <div className="relative w-full h-48 rounded-xl overflow-hidden border border-[#e5e7eb]">
              <Image
                src={coverPreview}
                alt="Cover preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setCoverImage(null);
                  setCoverPreview(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-black/50 text-white text-xs font-semibold hover:bg-black/70 transition-colors"
              >
                Remove
              </button>
            </div>
          ) : (
            <label
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed border-[#dbe1e6] bg-[#f9fafb] hover:bg-[#f0f2f4] transition-colors cursor-pointer"
            >
              <svg
                className="size-8 text-[#617789] mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <p className="text-sm font-medium text-[#111318]">
                Drop image here or click to upload
              </p>
              <p className="text-xs text-[#617789] mt-1">
                PNG, JPEG, WebP — max 5MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept={ALLOWED_IMAGE_TYPES.join(",")}
                className="hidden"
                onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
              />
            </label>
          )}
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="text-sm font-medium text-[#111318]">
            Course Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="e.g. Advanced Web Development"
            className="w-full px-4 py-2.5 rounded-lg text-sm text-[#111318] outline-0 ring ring-[#dbe1e6] focus:ring-[#135BEC] placeholder:text-[#617789] transition-shadow"
          />
        </div>

        {/* Code */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="code" className="text-sm font-medium text-[#111318]">
            Course Code <span className="text-red-500">*</span>
          </label>
          <input
            id="code"
            name="code"
            type="text"
            required
            placeholder="e.g. AWD-101"
            className="w-full px-4 py-2.5 rounded-lg text-sm text-[#111318] outline-0 ring ring-[#dbe1e6] focus:ring-[#135BEC] placeholder:text-[#617789] transition-shadow uppercase"
          />
          <p className="text-xs text-[#617789]">
            Must be unique within your organisation. Automatically uppercased.
          </p>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="description"
            className="text-sm font-medium text-[#111318]"
          >
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            placeholder="Describe what learners will gain from this course…"
            className="w-full px-4 py-2.5 rounded-lg text-sm text-[#111318] outline-0 ring ring-[#dbe1e6] focus:ring-[#135BEC] placeholder:text-[#617789] transition-shadow resize-none"
          />
        </div>

        {/* Status */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#111318]">
            Initial Status
          </label>
          <div className="flex gap-3">
            {(["draft", "active"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-all ${
                  status === s
                    ? s === "active"
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-amber-50 border-amber-200 text-amber-700"
                    : "bg-white border-[#dbe1e6] text-[#617789] hover:bg-gray-50"
                }`}
              >
                {s === "draft" ? "Draft" : "Active"}
              </button>
            ))}
          </div>
          <p className="text-xs text-[#617789]">
            {status === "draft"
              ? "Draft courses are not visible to learners."
              : "Active courses are immediately visible to enrolled learners."}
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600 font-medium bg-red-50 border border-red-100 px-4 py-3 rounded-lg">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2 pb-8">
          <Link
            href="/admin/courses"
            className="flex-1 py-2.5 rounded-lg border border-[#dbe1e6] text-sm font-semibold text-[#111318] hover:bg-gray-50 transition-colors text-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 py-2.5 rounded-lg bg-[#135BEC] hover:bg-[#135BEC]/90 text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? "Creating…" : "Create Course"}
          </button>
        </div>
      </form>
    </main>
  );
}
