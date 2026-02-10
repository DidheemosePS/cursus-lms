import Warning from "@/assets/icons/warning.svg";
import Notice from "@/assets/icons/notice.svg";
import { getAdminSystemAlertsByOrganization } from "../../../dal/admin/overview.dal";

export default async function SystemAlerts({
  organizationId,
}: {
  organizationId: string;
}) {
  const system_alerts =
    await getAdminSystemAlertsByOrganization(organizationId);

  return (
    <section>
      <h2 className="text-xl font-bold text-text-main mb-4">System Alerts</h2>
      <div className="bg-white rounded-lg overflow-hidden shadow-sm divide-y divide-[#f0f2f4]">
        {/* Alert Item 1 */}
        <div className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors">
          <Warning className="size-5 text-amber-500 mt-0.5" />
          <div className="flex-1">
            <p className="text-[#111318] text-sm font-medium">
              Missing Instructor Assignment
            </p>
            <p className="text-[#647687] text-sm">
              2 courses currently have no assigned instructor. This may prevent
              learners from accessing materials.
            </p>
          </div>
          <button className="text-[#135BEC] hover:text-[#135BEC]/80 text-sm font-medium cursor-pointer">
            Resolve
          </button>
        </div>
        {/* Alert Item 2 */}
        <div className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors">
          <Notice className="size-5 text-[#647687] mt-0.5" />
          <div className="flex-1">
            <p className="text-[#111318] text-sm font-medium">
              Unenrolled Learners
            </p>
            <p className="text-[#647687] text-sm">
              5 registered learners are not enrolled in any active courses.
            </p>
          </div>
          <button className="text-[#135BEC] hover:text-[#135BEC]/80 text-sm font-medium cursor-pointer">
            Resolve
          </button>
        </div>
      </div>
    </section>
  );
}
