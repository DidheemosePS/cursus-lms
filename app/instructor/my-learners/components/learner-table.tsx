import { LearnerRow as LearnerRowComponent } from "./learner-row";
import { LearnerRow } from "@/dal/instructors/learners.dal";

export function LearnerTable({ learners }: { learners: LearnerRow[] }) {
  if (learners.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-sm text-center">
        <p className="text-sm font-semibold text-[#111318]">
          No learners found
        </p>
        <p className="mt-1 text-xs text-[#617789]">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <section className="w-full flex flex-col rounded-lg divide-y divide-[#f0f2f4] overflow-hidden shadow-sm">
      {/* Table header */}
      <div className="hidden @5xl:grid @5xl:grid-cols-5 gap-4 px-6 py-4 text-xs font-semibold uppercase text-gray-500 tracking-wider bg-gray-200/50">
        <span>Learner</span>
        <span>Course</span>
        <span>Progress</span>
        <span>Submissions</span>
        <span>Action</span>
      </div>

      {learners.map((learner) => (
        <LearnerRowComponent
          key={`${learner.learnerId}-${learner.courseId}`}
          learner={learner}
        />
      ))}
    </section>
  );
}
