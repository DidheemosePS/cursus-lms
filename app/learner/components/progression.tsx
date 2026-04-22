import Graph from "@/assets/icons/graph.svg";
import View from "@/assets/icons/view.svg";
import Continue from "@/assets/icons/continue.svg";
import { getProgression } from "@/dal/learners/overview.dal";

// Theme
const progression_card_theme = {
  pending: {
    card_border: "border-(--secondary)/10",
    status: "bg-green-50 text-green-700 ring-green-600/20",
    progress_bar: "bg-green-500",
    button: "border-green-200 bg-green-50 text-green-700",
  },
  overdue: {
    card_border: "border-red-200",
    status: "bg-red-50 text-red-700 ring-red-600/20",
    progress_bar: "bg-red-500",
    button: "border-red-200 bg-red-50 text-red-700",
  },
  submitted: {
    card_border: "border-blue-200",
    status: "bg-blue-50 text-blue-700 ring-blue-600/20",
    progress_bar: "bg-blue-500",
    button: "border-blue-200 bg-blue-50 text-blue-700",
  },
};

type Status = keyof typeof progression_card_theme;

// Component
export default async function Progression() {
  // Data fetching
  const progressionData = await getProgression();

  return (
    <section className="mb-10">
      <div className="mb-5 flex items-center gap-2 text-(--secondary)">
        <Graph className="size-5" />
        <p>Linear Course Progression</p>
      </div>

      {progressionData.length === 0 ? (
        <p className="text-sm text-(--secondary)/60">
          You are not enrolled in any courses yet.
        </p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
          {progressionData.map((item) => {
            const status = item.status.toLowerCase() as Status;
            const card_theme = progression_card_theme[status];
            const isSubmitted = status === "submitted";
            const Icon = isSubmitted ? View : Continue;
            const buttonLabel = isSubmitted ? "View Submission" : "Continue";

            return (
              <div
                key={item.courseId}
                className={`rounded-lg border ${card_theme.card_border} bg-(--foreground) p-6 shadow-sm`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-lg font-bold text-(--secondary)">
                      {item.title}
                    </p>
                    <p className="text-xs text-(--secondary)/60 mt-1">
                      {item.moduleLabel}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-md ${card_theme.status} px-2 py-1 text-xs font-medium ring-1 ring-inset`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex flex-col gap-2 text-xs text-(--secondary)/60">
                    <span>Start: {item.startDate}</span>
                    <span className="font-medium text-(--secondary)">
                      Due: {item.dueDate}
                    </span>
                  </div>
                  <div className="w-full h-2 overflow-hidden rounded-full bg-(--secondary)/10">
                    <div
                      className={`h-2 ${card_theme.progress_bar}`}
                      style={{ width: `${item.completedPercentage}%` }}
                    />
                  </div>
                  <p className="text-right text-xs font-bold text-(--secondary)">
                    {item.completedPercentage}% Complete
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-(--secondary)/10">
                  <a
                    href={`/learner/my-courses/${item.courseId}#${item.moduleId}`}
                    className={`w-full flex items-center justify-center gap-2 rounded-lg border ${card_theme.button} px-4 py-2.5 text-sm font-semibold shadow-sm`}
                  >
                    <Icon className="size-4" />
                    <span>{buttonLabel}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
