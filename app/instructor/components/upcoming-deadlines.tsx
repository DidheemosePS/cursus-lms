import Link from "next/link";
import type { UpcomingDeadline } from "@/dal/instructors/dashboard.dal";
import { timeStampStyling } from "@/utils/timestamp-formatter";

function getDaysLeftLabel(daysLeft: number) {
  if (daysLeft === 0)
    return {
      label: "Due today",
      color: "text-red-600 bg-red-50 border-red-100",
    };
  if (daysLeft === 1)
    return {
      label: "Due tomorrow",
      color: "text-orange-700 bg-orange-50 border-orange-100",
    };
  return {
    label: `${daysLeft} days left`,
    color: "text-[#617789] bg-gray-50 border-gray-200",
  };
}

function ProgressBar({
  submitted,
  total,
}: {
  submitted: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((submitted / total) * 100) : 0;
  const color =
    pct >= 80 ? "bg-green-500" : pct >= 40 ? "bg-[#135BEC]" : "bg-orange-400";

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[#e5e7eb] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-medium text-[#111318] shrink-0">
        {submitted}/{total}
      </span>
    </div>
  );
}

export function UpcomingDeadlines({
  deadlines,
}: {
  deadlines: UpcomingDeadline[];
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-base font-bold text-[#111318]">
            Upcoming Deadlines
          </p>
          <p className="text-xs text-[#617789] mt-0.5">
            Module deadlines in the next 7 days
          </p>
        </div>
        <Link
          href="/instructor/my-courses"
          className="text-xs font-bold text-[#135BEC] hover:underline shrink-0"
        >
          View courses
        </Link>
      </div>

      {deadlines.length === 0 ? (
        <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow-sm text-center">
          <p className="text-sm text-[#617789]">
            No deadlines in the next 7 days.
          </p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-[#f0f2f4] rounded-lg overflow-hidden shadow-sm bg-white">
          {deadlines.map((d) => {
            const { label, color } = getDaysLeftLabel(d.daysLeft);
            const { datePart, timePart } = timeStampStyling(d.dueDate);
            return (
              <div
                key={d.moduleId}
                className="flex flex-col @3xl:flex-row @3xl:items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                {/* Module info */}
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-[#111318] truncate">
                      Module {d.modulePosition} · {d.moduleTitle}
                    </p>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${color}`}
                    >
                      {label}
                    </span>
                  </div>
                  <p className="text-xs text-[#617789] mt-0.5 truncate">
                    {d.courseTitle}{" "}
                    <span className="text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full text-[10px] font-semibold">
                      {d.courseCode}
                    </span>
                  </p>
                  <p className="text-xs text-[#617789] mt-0.5">
                    Due: {datePart} {timePart}
                  </p>
                </div>

                {/* Submission progress */}
                <div className="flex flex-col gap-1 @3xl:w-52 shrink-0">
                  <p className="text-[10px] font-bold text-[#617789] uppercase tracking-wider">
                    Submissions
                  </p>
                  <ProgressBar
                    submitted={d.submittedCount}
                    total={d.totalLearners}
                  />
                  <p className="text-[10px] text-[#617789]">
                    {d.remainingCount === 0
                      ? "All learners submitted"
                      : `${d.remainingCount} learner${
                          d.remainingCount === 1 ? "" : "s"
                        } yet to submit`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
