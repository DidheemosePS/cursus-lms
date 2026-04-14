import { Suspense } from "react";
import Group from "@/assets/icons/group.svg";
import CircleTick from "@/assets/icons/circle-tick.svg";
import Warning from "@/assets/icons/warning.svg";
import Clock from "@/assets/icons/pending.svg";
import { getInstructors } from "@/dal/admin/instructors.dal";
import { InstructorTable } from "./components/instructor-table";
import InstructorFilters from "./components/instructor-filters";
import InviteInstructorModal from "./components/invite-modal";
import { LearnerFooter } from "@/app/instructor/my-learners/components/learner-footer";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: "active" | "pending_invite" | "inactive";
    page?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));

  const { instructors, total, pageSize, counts } = await getInstructors({
    search: params.search,
    status: params.status,
    page,
  });

  const statCards = [
    {
      title: "Total Instructors",
      value: counts.all,
      icon: (
        <div className="size-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
          <Group className="size-5" />
        </div>
      ),
    },
    {
      title: "Active",
      value: counts.active,
      icon: (
        <div className="size-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
          <CircleTick className="size-5" />
        </div>
      ),
    },
    {
      title: "Pending Invite",
      value: counts.pending_invite,
      icon: (
        <div className="size-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
          <Clock className="size-5" />
        </div>
      ),
    },
    {
      title: "Inactive",
      value: counts.inactive,
      icon: (
        <div className="size-10 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center">
          <Warning className="size-5" />
        </div>
      ),
    },
  ];

  return (
    <main className="@container min-h-[calc(100dvh-4rem)] px-4 py-8 md:px-12 flex flex-col gap-8">
      {/* Header */}
      <header className="flex flex-col @3xl:flex-row @3xl:items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-2xl font-bold tracking-tight text-[#111318]">
            Instructors
          </p>
          <p className="text-sm text-[#616f89]">
            Manage instructors and their course assignments.
          </p>
        </div>
        <InviteInstructorModal />
      </header>

      {/* Stat cards */}
      <section className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="bg-white p-5 rounded-lg border border-slate-100 shadow-sm flex items-center justify-between hover:border-[#135BEC]/30 transition-colors"
          >
            <div className="space-y-1">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-slate-900">{card.value}</p>
            </div>
            {card.icon}
          </div>
        ))}
      </section>

      {/* Filters */}
      <Suspense>
        <InstructorFilters counts={counts} />
      </Suspense>

      {/* Table */}
      <InstructorTable instructors={instructors} />

      {/* Pagination */}
      <Suspense>
        <LearnerFooter total={total} pageSize={pageSize} currentPage={page} />
      </Suspense>
    </main>
  );
}
