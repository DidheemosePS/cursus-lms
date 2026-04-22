import Link from "next/link";
import Inbox from "@/assets/icons/inbox.svg";
import CircleTick from "@/assets/icons/circle-tick.svg";
import Group from "@/assets/icons/group.svg";
import Warning from "@/assets/icons/warning.svg";
import type { DashboardStats } from "@/dal/instructors/dashboard.dal";

interface StatCard {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  href: string;
  linkLabel: string;
}

export function StatCards({ stats }: { stats: DashboardStats }) {
  const cards: StatCard[] = [
    {
      title: "Pending Submissions",
      value: stats.pending,
      icon: Inbox,
      iconColor: "text-[#135BEC]",
      href: "/instructor/submissions?status=pending",
      linkLabel: "Review now",
    },
    {
      title: "Late Submissions",
      value: stats.late,
      icon: Warning,
      iconColor: "text-red-500",
      href: "/instructor/submissions?status=late",
      linkLabel: "View late",
    },
    {
      title: "Reviewed Submissions",
      value: stats.reviewed,
      icon: CircleTick,
      iconColor: "text-green-500",
      href: "/instructor/submissions?status=reviewed",
      linkLabel: "View all",
    },
    {
      title: "Total Learners",
      value: stats.totalLearners,
      icon: Group,
      iconColor: "text-gray-500",
      href: "/instructor/my-learners",
      linkLabel: "View learners",
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="relative flex flex-col justify-between h-32 rounded-xl p-5 bg-white shadow-sm overflow-hidden"
          >
            {/* Background icon */}
            <div className="absolute right-0 top-0 opacity-10 p-5">
              <Icon className={`size-16 ${card.iconColor}`} />
            </div>

            <p className="text-[#617789] text-sm font-medium">{card.title}</p>

            <div className="flex items-end justify-between">
              <p className="text-[#111318] text-4xl font-bold">{card.value}</p>
              <Link
                href={card.href}
                className={`text-xs font-semibold ${card.iconColor} hover:underline hover:cursor-pointer`}
              >
                {card.linkLabel}
              </Link>
            </div>
          </div>
        );
      })}
    </section>
  );
}
