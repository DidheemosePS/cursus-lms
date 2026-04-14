import RecentActivities from "./components/recent-activities";
import SystemAlerts from "./components/system-alerts";
import Summary from "./components/summary";
import {
  getAdminOverview,
  getAdminSystemAlerts,
  getRecentActivities,
} from "@/dal/admin/overview.dal";

export default async function Page() {
  // Fire all three in parallel
  const [overview, alerts, activities] = await Promise.all([
    getAdminOverview(),
    getAdminSystemAlerts(),
    getRecentActivities(),
  ]);

  return (
    <div className="min-h-[calc(100dvh-4rem)] px-4 py-8 md:px-12 space-y-8">
      <Summary overview={overview} />
      <SystemAlerts alerts={alerts} />
      <RecentActivities activities={activities} />
    </div>
  );
}
