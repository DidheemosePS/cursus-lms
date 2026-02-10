import RecentActivities from "./components/recent-activities";
import ManagementShortcuts from "./components/management-shortcuts";
import SystemAlerts from "./components/system-alerts";
import Summary from "./components/summary";
import { getSession } from "@/lib/auth/auth";

// Default Avatar
export const avatar =
  "https://testingbot.com/free-online-tools/random-avatar/100?img=2";

export default async function Page() {
  // Db call
  const { organizationId } = await getSession();

  return (
    <div className="min-h-[calc(100dvh-4rem)] px-4 py-8 md:px-12 space-y-8">
      <Summary organizationId={organizationId} />
      <SystemAlerts organizationId={organizationId} />
      <ManagementShortcuts />
      <RecentActivities organizationId={organizationId} />
    </div>
  );
}
