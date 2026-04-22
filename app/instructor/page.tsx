import { getSession } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import {
  getDashboardStats,
  getRecentSubmissions,
  getUpcomingDeadlines,
} from "@/dal/instructors/dashboard.dal";
import { StatCards } from "./components/stat-cards";
import { RecentSubmissions } from "./components/recent-submissions";
import { UpcomingDeadlines } from "./components/upcoming-deadlines";

// Fire all three queries in parallel
export default async function Page() {
  const { userId, name } = await getSession();
  if (!userId) redirect("/login");

  const [stats, recentSubmissions, upcomingDeadlines] = await Promise.all([
    getDashboardStats(),
    getRecentSubmissions(),
    getUpcomingDeadlines(),
  ]);

  const firstName = name?.split(" ")[0] ?? "Instructor";

  return (
    <main className="@container p-4 md:p-6 lg:p-8 space-y-8 w-full min-h-[calc(100dvh-4rem)]">
      {/* Header */}
      <header className="pt-2">
        <p className="text-2xl font-black text-[#111318]">
          Good to see you, {firstName}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Here&apos;s what needs your attention today.
        </p>
      </header>

      {/* Stat cards */}
      <StatCards stats={stats} />

      {/* Two column layout on large screens */}
      <div className="grid grid-cols-1 @4xl:grid-cols-[1fr_380px] gap-8">
        {/* Recent not reviewed submissions */}
        <RecentSubmissions submissions={recentSubmissions} />

        {/* Upcoming deadlines */}
        <UpcomingDeadlines deadlines={upcomingDeadlines} />
      </div>
    </main>
  );
}
