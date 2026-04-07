import CircleTick from "@/assets/icons/circle-tick.svg";
import CalendarCheck from "@/assets/icons/calendar-check.svg";
import Calendar from "@/assets/icons/calendar.svg";
import { Module } from "../page";
import SubmissionHistory from "../submission-history/submission-history";
import { timeStampStyling } from "@/utils/timestamp-formatter";

export default function Completed({ module }: { module: Module }) {
  const hasLateSubmission = module.submissions.some((s) => s.isLate);
  const { submissions } = module;

  const startDate = timeStampStyling(module.startDate);
  const dueDate = timeStampStyling(module.dueDate);

  const lastSubmission = submissions.reduce((latest, current) =>
    current.attemptNumber > latest.attemptNumber ? current : latest,
  );
  const submissionDate = timeStampStyling(lastSubmission.updatedAt);

  return (
    <div
      id={module.id}
      className="bg-white rounded-lg border border-green-100 p-5 md:p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center"
    >
      <div className="size-12 rounded-full bg-green-100 text-green-500 flex items-center justify-center shrink-0">
        <CircleTick className="size-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <p className="text-xs font-bold uppercase tracking-wider text-green-500">
            Module {module.position} · Completed
          </p>
          {hasLateSubmission && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-800">
              Late Submission
            </span>
          )}
        </div>
        <p className="text-lg font-bold text-[#111318] mb-1">{module.title}</p>
        <p className="text-sm text-[#616f89] mb-3 line-clamp-2">
          {module.description}
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#616f89]">
          <span className="flex items-center gap-1 font-semibold">
            <Calendar className="size-3.5" />
            Started: {startDate.datePart} · {startDate.timePart}
          </span>
          <span className="flex items-center gap-1 font-semibold">
            <CalendarCheck className="size-3.5" />
            Due: {dueDate.datePart} · {dueDate.timePart}
          </span>
          <span className="flex items-center gap-1 font-semibold">
            <CalendarCheck className="size-3.5" />
            Submitted: {submissionDate.datePart} · {submissionDate.timePart}
          </span>
        </div>
      </div>

      {/* Pass moduleTitle so the modal header is dynamic */}
      <SubmissionHistory submissions={submissions} moduleTitle={module.title} />
    </div>
  );
}
