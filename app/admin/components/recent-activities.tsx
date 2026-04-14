import type { RecentActivity } from "@/dal/admin/overview.dal";
import { timeStampStyling } from "@/utils/timestamp-formatter";

const ACTION_THEME: Record<string, { label: string; className: string }> = {
  created: {
    label: "Created",
    className: "bg-green-100 text-green-700",
  },
  updated: {
    label: "Updated",
    className: "bg-gray-100 text-gray-700",
  },
  modified: {
    label: "Modified",
    className: "bg-blue-100 text-blue-700",
  },
  assigned: {
    label: "Assigned",
    className: "bg-purple-100 text-purple-700",
  },
  delete: {
    label: "Deleted",
    className: "bg-red-100 text-red-700",
  },
};

export default function RecentActivities({
  activities,
}: {
  activities: RecentActivity[];
}) {
  return (
    <section className="@container">
      <header className="mb-4 flex items-center justify-between">
        <p className="text-xl font-bold text-[#111318]">Recent Activities</p>
      </header>

      {activities.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm px-6 py-8 text-center">
          <p className="text-sm font-semibold text-[#111318]">
            No recent activity
          </p>
          <p className="text-xs text-[#616f89] mt-1">
            Activity will appear here as users interact with the platform.
          </p>
        </div>
      ) : (
        <div className="w-full flex flex-col rounded-lg divide-y divide-[#f0f2f4] overflow-hidden shadow-sm">
          {/* Table header */}
          <div className="hidden @3xl:grid @3xl:grid-cols-4 gap-4 px-6 py-4 text-xs font-semibold uppercase text-gray-500 tracking-wider bg-gray-100">
            <span>Action</span>
            <span>Target</span>
            <span>User</span>
            <span>Time</span>
          </div>

          {activities.map((activity) => {
            const theme =
              ACTION_THEME[activity.action] ?? ACTION_THEME.modified;
            const { datePart, timePart } = timeStampStyling(activity.createdAt);

            return (
              <div
                key={activity.id}
                className="group flex flex-col @3xl:grid @3xl:grid-cols-4 items-start @3xl:items-center gap-2 @3xl:gap-4 p-4 @3xl:px-6 @3xl:py-4 bg-white hover:bg-gray-50 transition-colors"
              >
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${theme.className}`}
                >
                  {theme.label}
                </span>
                <p className="font-medium text-[#111318] truncate">
                  {activity.target}
                </p>
                <p className="text-sm text-[#617789] truncate">
                  {activity.user.name}
                </p>
                <p className="text-xs text-[#617789]">
                  {timePart}, {datePart}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
