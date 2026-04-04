import PendingIcon from "@/assets/icons/pending.svg";
import File from "@/assets/icons/file.svg";
import Upload from "@/assets/icons/upload.svg";
import Link from "next/link";
import { getPendingModules } from "@/dal/learners/overview/overview.dal";

// Component
export default async function Pending() {
  // Data fetching
  const pendingModules = await getPendingModules();

  if (pendingModules.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center gap-2">
        <PendingIcon className="size-5 text-[#F97316]" />
        <p className="text-lg font-bold text-(--secondary)">Pending Actions</p>
      </div>
      <div className="overflow-hidden rounded-lg border border-(--secondary)/10 bg-(--foreground) shadow-sm">
        <div className="divide-y divide-(--secondary)/10 px-5">
          {pendingModules.map((item) => (
            <div
              key={item.moduleId}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-5"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    item.isOverdue
                      ? "bg-red-50 text-red-600"
                      : "bg-blue-50 text-blue-600"
                  }`}
                >
                  <File className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-(--secondary)">
                    {item.title}
                  </p>
                  <p className="text-sm text-(--secondary)/60">
                    {item.description}
                  </p>
                  <p
                    className={`mt-1 text-xs font-medium ${
                      item.isOverdue ? "text-red-600" : "text-orange-600"
                    }`}
                  >
                    Due {item.dueDateLabel}
                  </p>
                </div>
              </div>
              <Link
                href={`/learner/my-courses/${item.courseId}#${item.moduleId}`}
                className="w-full md:max-w-max flex items-center justify-center gap-2 rounded-lg border border-(--secondary)/10 px-4 py-2 text-xs font-bold text-(--secondary) shadow-sm hover:bg-(--secondary)/5 transition-colors"
              >
                <Upload className="size-5" />
                <span>Upload Assignment</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
