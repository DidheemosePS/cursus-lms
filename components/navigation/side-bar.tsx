"use client";

import { useMemo, memo } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import SignOut from "@/assets/icons/signout.svg";

export type NAV_LINK = {
  id: number;
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  section: "top" | "bottom";
};

type SideBarProps = {
  NAV_LINKS: NAV_LINK[];
};

function SideBar({ NAV_LINKS }: SideBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Split links by section once
  const itemsBySection = useMemo(() => {
    return {
      top: NAV_LINKS.filter((item) => item.section === "top"),
      bottom: NAV_LINKS.filter((item) => item.section === "bottom"),
    };
  }, [NAV_LINKS]);

  const renderItems = (items: NAV_LINK[]) =>
    items.map((item) => {
      const Icon = item.icon;

      const isActive =
        item.href === NAV_LINKS[0]?.href
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);

      return (
        <Link
          key={item.id}
          href={item.href}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            isActive
              ? "bg-[#135bec] hover:bg-[#135bec]/90 text-white hover:text-white/90"
              : "hover:bg-gray-100 text-[#616f89] hover:text-[#111318]"
          }`}
        >
          <Icon className="size-5" />
          <span>{item.label}</span>
        </Link>
      );
    });

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="md:h-[calc(100dvh-4rem)] md:w-64 md:fixed md:top-16 md:z-40 shadow-md bg-white flex flex-col justify-between p-4 overflow-y-auto border-r sm:border-0 border-[#f0f2f4] divide-y md:divide-y-0 divide-gray-200">
      <div className="flex flex-col gap-1 pb-4 md:pb-0">
        {renderItems(itemsBySection.top)}
      </div>

      <div className="flex flex-col pt-4 md:border-t border-gray-200">
        {renderItems(itemsBySection.bottom)}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 text-[#616f89] hover:text-[#111318]"
        >
          <SignOut className="size-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

// Prevent re-renders when NAV_LINKS reference is stable
export default memo(SideBar);
