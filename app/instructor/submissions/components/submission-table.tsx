import { SubmissionRow as SubmissionRowComponent } from "./submission-row";
import type { SubmissionRow } from "@/dal/instructors/submissions.dal";

export function SubmissionTable({
  submissions,
}: {
  submissions: SubmissionRow[];
}) {
  if (submissions.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-sm text-center">
        <p className="text-sm font-semibold text-[#111318]">
          No submissions found
        </p>
        <p className="mt-1 text-xs text-[#617789]">
          Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <section className="w-full flex flex-col rounded-lg divide-y divide-[#f0f2f4] overflow-hidden shadow-sm">
      {/* Table header */}
      <div className="hidden @5xl:grid @5xl:grid-cols-5 gap-4 px-6 py-4 text-xs font-semibold uppercase text-gray-500 tracking-wider bg-gray-200/50">
        <span>Learner</span>
        <span>Course & Module</span>
        <span>Status & Attempt</span>
        <span>Dates & File</span>
        <span>Action</span>
      </div>
      {submissions.map((submission) => (
        <SubmissionRowComponent key={submission.id} submission={submission} />
      ))}
    </section>
  );
}
