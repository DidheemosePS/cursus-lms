// interface RecentActivitiesProps {}

import { getAdminRecentActivitiesByOrganization } from "../../../dal/admin/overview.dal";

export default async function RecentActivities({
  organizationId,
}: {
  organizationId: string;
}) {
  const recent_activities = await getAdminRecentActivitiesByOrganization(
    organizationId
  );

  return (
    <section className="@container">
      <header className="mb-4 flex justify-between">
        <p className="text-2xl font-bold tracking-tight text-[#111318]">
          Recent Activities
        </p>
        <button className="text-[#135BEC] hover:text-[#135BEC]/80 text-sm font-medium cursor-pointer">
          View Log
        </button>
      </header>
      <div className="w-full flex flex-col rounded-lg divide-y divide-[#f0f2f4] overflow-hidden shadow-sm">
        <div className="grid grid-cols-4 gap-4 px-6 py-4 text-xs font-semibold uppercase text-gray-500 tracking-wider bg-gray-100">
          <span>Action</span>
          <span>Target</span>
          <span>User</span>
          <span>Time</span>
        </div>
        {recent_activities?.map((activity) => {
          return (
            <div
              key={activity?.id}
              className="group grid grid-cols-4 items-center gap-4 p-4 @5xl:px-6 @5xl:py-5 transition-colors bg-white hover:bg-gray-50"
            >
              <div
                className={`max-w-max inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${
                  activity?.action === "created" &&
                  "bg-green-100 text-green-700"
                } ${
                  activity?.action === "assigned" && "bg-blue-100 text-blue-700"
                } ${
                  activity?.action === "updated" && "bg-gray-100 text-gray-700"
                }`}
              >
                {activity?.action}
              </div>
              <p className="font-medium text-[#111318]">{activity?.target}</p>
              <p className="text-[#647687]">{activity?.user.name}</p>
              <p className="text-[#647687]">
                {activity?.createdAt.toDateString()}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
