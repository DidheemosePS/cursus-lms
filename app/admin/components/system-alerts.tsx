import Warning from "@/assets/icons/warning.svg";
import Notice from "@/assets/icons/notice.svg";
import Link from "next/link";
import type { SystemAlerts as SystemAlertsType } from "@/dal/admin/overview.dal";

interface Alert {
  id: string;
  type: "warning" | "info";
  message: string;
  description: string;
  href: string;
  show: boolean;
}

function buildAlerts(alerts: SystemAlertsType): Alert[] {
  return [
    {
      id: "no-instructor",
      type: "warning",
      message: "Courses without instructors",
      description: `${alerts.coursesWithoutInstructors} active ${
        alerts.coursesWithoutInstructors === 1 ? "course has" : "courses have"
      } no assigned instructor. Learners may not be able to access materials.`,
      href: "/admin/courses?status=active",
      show: alerts.coursesWithoutInstructors > 0,
    },
    {
      id: "unenrolled",
      type: "info",
      message: "Unenrolled learners",
      description: `${alerts.unenrolledLearners} active ${
        alerts.unenrolledLearners === 1 ? "learner is" : "learners are"
      } not enrolled in any course.`,
      href: "/admin/learners",
      show: alerts.unenrolledLearners > 0,
    },
    {
      id: "draft-courses",
      type: "info",
      message: "Draft courses",
      description: `${alerts.draftCourses} ${
        alerts.draftCourses === 1 ? "course is" : "courses are"
      } still in draft and not visible to learners.`,
      href: "/admin/courses?status=draft",
      show: alerts.draftCourses > 0,
    },
    {
      id: "pending-invites",
      type: "warning",
      message: "Stale pending invites",
      description: `${alerts.pendingInvites} ${
        alerts.pendingInvites === 1 ? "invite has" : "invites have"
      } been pending for more than 7 days.`,
      href: "/admin/learners?status=pending_invite",
      show: alerts.pendingInvites > 0,
    },
  ];
}

export default function SystemAlerts({ alerts }: { alerts: SystemAlertsType }) {
  const activeAlerts = buildAlerts(alerts).filter((a) => a.show);

  return (
    <section>
      <h2 className="text-xl font-bold text-[#111318] mb-4">System Alerts</h2>

      {activeAlerts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm px-6 py-8 text-center">
          <p className="text-sm font-semibold text-[#111318]">
            All systems healthy
          </p>
          <p className="text-xs text-[#616f89] mt-1">No alerts at this time.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg overflow-hidden shadow-sm divide-y divide-[#f0f2f4]">
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors"
            >
              {alert.type === "warning" ? (
                <Warning className="size-5 text-amber-500 mt-0.5 shrink-0" />
              ) : (
                <Notice className="size-5 text-[#617789] mt-0.5 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[#111318] text-sm font-medium">
                  {alert.message}
                </p>
                <p className="text-[#617789] text-sm mt-0.5">
                  {alert.description}
                </p>
              </div>
              <Link
                href={alert.href}
                className="text-[#135BEC] hover:text-[#135BEC]/80 text-sm font-medium shrink-0"
              >
                Resolve
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
