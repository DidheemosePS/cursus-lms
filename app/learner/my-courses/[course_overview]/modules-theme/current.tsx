import CalendarCheck from "@/assets/icons/calendar-check.svg";
import Calendar from "@/assets/icons/calendar.svg";
import Play from "@/assets/icons/play.svg";
import Notice from "@/assets/icons/notice.svg";
import { Module } from "../page";
import { formatTimeAgo, timeStampStyling } from "@/utils/timestamp-formatter";
import SubmissionForm from "./submission-form";

export default async function Current({ module }: { module: Module }) {
  const startDate = timeStampStyling(module.startDate);
  const dueDate = timeStampStyling(module.dueDate);

  const dueIn = formatTimeAgo(module.dueDate, "day");

  return (
    <div className="bg-white rounded-lg border border-blue-100 border-l-4 border-l-blue-500 p-5 md:p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center transform scale-[1.01]">
      <div className="size-12 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center">
        <Play className="size-5" />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-500">
            Module {module.position} • Current
          </p>
          {dueIn && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-800">
              Due {dueIn}
            </span>
          )}
        </div>
        <p className="text-lg font-bold text-[#111318] mb-1">{module.title}</p>
        <p className="text-sm text-[#616f89] mb-3 line-clamp-2">
          {module.description}
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#616f89]">
          <span className="flex items-center gap-1 font-semibold">
            <Calendar className="size-3.5 stroke-[1.5]" />
            Started: {startDate.datePart} • {startDate.timePart}
          </span>
          <span className="flex items-center gap-1 font-semibold">
            <CalendarCheck className="size-3.5 stroke-[1.5]" />
            Due: {dueDate.datePart} • {dueDate.timePart}
          </span>
        </div>
        {dueIn && (
          <div className="mt-2 flex items-center gap-1 text-[11px] text-[#616f89]">
            <Notice className="size-3" />
            Late submissions allowed. Instructor will see timestamp.
          </div>
        )}
      </div>
      <SubmissionForm moduleId={module.id} />
    </div>
  );
}
