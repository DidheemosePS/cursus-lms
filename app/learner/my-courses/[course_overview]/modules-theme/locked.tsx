import CalendarCheck from "@/assets/icons/calendar-check.svg";
import Calendar from "@/assets/icons/calendar.svg";
import Lock from "@/assets/icons/lock.svg";
import { Module } from "../page";
import { timeStampStyling } from "@/utils/timestamp-formatter";

export default function Locked({
  showDisabledButton = false,
  module,
}: {
  showDisabledButton?: boolean;
  module: Module;
}) {
  const startDate = timeStampStyling(module.startDate);
  const dueDate = timeStampStyling(module.startDate);

  return (
    <div
      id={module.id}
      className="bg-white rounded-lg border border-gray-100 p-5 md:p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center opacity-75"
    >
      <div className="size-12 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
        <Lock className="size-5" />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Module {module.position} • Locked
          </p>
        </div>
        <p className="text-lg font-bold text-[#111318] mb-1">{module.title}</p>
        <p className="text-sm text-[#616f89] mb-3 line-clamp-2">
          {module.description}
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#616f89]">
          <span className="flex items-center gap-1 font-semibold">
            <Calendar className="size-3.5 stroke-[1.5]" />
            Starts: {startDate.datePart} • {startDate.timePart}
          </span>
          <span className="flex items-center gap-1 font-semibold">
            <CalendarCheck className="size-3.5 stroke-[1.5]" />
            Due: {dueDate.datePart} • {dueDate.timePart}
          </span>
        </div>
      </div>
      {showDisabledButton && (
        <button
          disabled
          className="w-full ml-auto md:w-auto px-5 py-2.5 bg-gray-100 text-gray-500 border border-transparent text-sm font-medium rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Lock className="size-3" />
          Locked until previous module is completed
        </button>
      )}
    </div>
  );
}
