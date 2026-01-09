import type { SubmissionData } from "../page";
import SubmissionTheme from "./submission-theme";

export default function Submissions({
  submission_data,
}: {
  submission_data: SubmissionData[];
}) {
  return (
    <section className="w-full flex flex-col rounded-lg divide-y divide-[#f0f2f4] overflow-hidden shadow-sm">
      <div className="hidden @5xl:grid @5xl:grid-cols-5 gap-4 px-6 py-4 text-xs font-semibold uppercase text-gray-500 tracking-wider bg-gray-200/50">
        <span>Student</span>
        <span>Course &amp; Module</span>
        <span>Status &amp; Attempt</span>
        <span>Dates</span>
        <span>Action</span>
      </div>
      {/* If no assignments */}
      {submission_data?.length ? (
        submission_data?.map((item) => (
          /* PENDING, LATE, REVIEWED */
          <SubmissionTheme key={item.id} {...item} />
        ))
      ) : (
        <div className="flex-col items-center justify-center py-12 text-center bg-white">
          <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">
            assignment_turned_in
          </span>
          <p className="text-gray-500">No submissions to review right now.</p>
        </div>
      )}
    </section>
  );
}
