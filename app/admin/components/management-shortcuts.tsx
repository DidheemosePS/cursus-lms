import School from "@/assets/icons/school.svg";
import Group from "@/assets/icons/group.svg";
import Active from "@/assets/icons/active.svg";
import PlatformSettings from "@/assets/icons/platform-settings.svg";
import Link from "next/link";

export default function ManagementShortcuts() {
  const management_shortcuts = [
    {
      id: 1,
      title: "Manage Courses",
      operation: "Create, edit & assign",
      href: "#",
      icon: <Active className="size-5" />,
    },
    {
      id: 2,
      title: "Manage Instructors",
      operation: "Staff directory & roles",
      href: "#",
      icon: <Group className="size-5" />,
    },
    {
      id: 3,
      title: "Manage Learners",
      operation: "Enrollment & roster",
      href: "#",
      icon: <School className="size-5" />,
    },
    {
      id: 4,
      title: "Platform Settings",
      operation: "System configuration",
      href: "#",
      icon: <PlatformSettings className="size-5" />,
    },
  ];

  return (
    <section>
      <h2 className="text-xl font-bold text-text-main mb-4">
        Management Shortcuts
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Shortcuts */}
        {management_shortcuts?.map((shortcut) => {
          return (
            <Link
              key={shortcut?.id}
              className="group flex flex-col h-full justify-between gap-4 bg-white p-6 rounded-lg border border-gray-50 shadow-sm hover:border-[#135BEC]/30 hover:shadow-md transition-all"
              href={shortcut?.href}
            >
              <div className="size-10 bg-gray-100 rounded-lg flex items-center justify-center backdrop-blur-sm">
                {shortcut?.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg">{shortcut?.title}</h3>
                <p className="text-sm mt-1 text-[#647687]">
                  {shortcut?.operation}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
