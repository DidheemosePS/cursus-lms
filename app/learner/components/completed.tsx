import PendingIcon from "@/assets/icons/pending.svg";
import View from "@/assets/icons/view.svg";
import Star from "@/assets/icons/star.svg";
import CheckList from "@/assets/icons/check-list.svg";
import Link from "next/link";
import { getCompletedSubmissions } from "@/dal/learners/overview.dal";

// Theme
const completed_work_theme = {
  submitted: "bg-blue-50 text-blue-700 ring-blue-700/10",
  graded: "bg-green-50 text-green-700 ring-green-700/10",
};

// Component
export default async function Completed() {
  // Data fetching
  const completedWork = await getCompletedSubmissions();

  if (completedWork.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center gap-2">
        <PendingIcon className="size-5 text-[#F97316]" />
        <p className="text-lg font-bold text-(--secondary)">Completed Works</p>
      </div>
      <div className="overflow-hidden rounded-lg border border-(--secondary)/10 bg-(--foreground) shadow-sm">
        <div className="divide-y divide-(--secondary)/10 px-5">
          {completedWork.map((item) => {
            const status = item.status.toLowerCase() as "submitted" | "graded";
            const isGraded = status === "graded";

            return (
              <div
                key={item.submissionId}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-5"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      isGraded
                        ? "bg-green-50 text-green-600"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {isGraded ? (
                      <Star className="size-5" />
                    ) : (
                      <CheckList className="size-5" />
                    )}
                  </div>

                  {/* Text */}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-(--secondary)">
                        {item.title}
                      </p>
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${completed_work_theme[status]}`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-sm text-(--secondary)/60">
                      {item.description}
                    </p>
                    <p className="mt-1 text-xs text-(--secondary)/60">
                      Submitted on {item.submittedOn}
                    </p>
                    {/* Show feedback snippet if graded */}
                    {isGraded && item.feedback && (
                      <p className="mt-1 text-xs font-medium text-green-600 line-clamp-1">
                        Feedback: {item.feedback}
                      </p>
                    )}
                  </div>
                </div>

                {/* View submission button */}
                <Link
                  href={`/learner/my-courses/${item.courseId}#${item.moduleId}`}
                  className="w-full md:max-w-max flex items-center justify-center gap-2 rounded-lg border border-(--secondary)/10 px-4 py-2 text-xs font-bold text-(--secondary)/60 shadow-sm hover:bg-(--secondary)/5 transition-colors"
                >
                  <View className="size-5" />
                  <span>View Submission</span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
