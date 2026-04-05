"use client";

import { Activity, useState } from "react";
import Sidebar from "@/components/navigation/side-bar";
import LearnerNav from "@/components/navigation/nav-bar";
import Dashboard from "@/assets/icons/dashboard.svg";
import MyCourse from "@/assets/icons/books.svg";
import Settings from "@/assets/icons/settings.svg";
import Question from "@/assets/icons/question.svg";
import Group from "@/assets/icons/group.svg";
import Submission from "@/assets/icons/inbox.svg";
import type { NAV_LINK } from "@/components/navigation/side-bar";
import { SessionData } from "@/lib/auth/auth";

export default function Page({
  children,
  session,
}: {
  children: React.ReactNode;
  session: SessionData;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const NAV_LINKS: NAV_LINK[] = [
    {
      id: 1,
      href: "/admin",
      label: "Overview",
      icon: Dashboard,
      section: "top",
    },
    {
      id: 2,
      href: "/admin/courses",
      label: "Courses",
      icon: Submission,
      section: "top",
    },
    {
      id: 3,
      href: "/admin/instructors",
      label: "Instructors",
      icon: Group,
      section: "top",
    },
    {
      id: 4,
      href: "/admin/learners",
      label: "Learners",
      icon: MyCourse,
      section: "top",
    },
    {
      id: 6,
      href: "/instructor/settings",
      label: "Settings",
      icon: Settings,
      section: "bottom",
    },
    {
      id: 7,
      href: "/instructor/help-support",
      label: "Help and Support",
      icon: Question,
      section: "bottom",
    },
  ];

  return (
    <main className="h-full overflow-y-auto">
      <div className="fixed top-0 z-50 w-full">
        <LearnerNav isOpen={isOpen} setIsOpen={setIsOpen} session={session} />
        <Activity mode={isOpen ? "visible" : "hidden"}>
          <Sidebar NAV_LINKS={NAV_LINKS} />
        </Activity>
      </div>
      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 transition-all duration-300 z-40"
        />
      )}
      <div className="md:flex">
        <div className="max-md:hidden">
          <Sidebar NAV_LINKS={NAV_LINKS} />
        </div>
        <main
          className={`flex-1 pt-16 md:pl-64 bg-[#F6F6F8] ${
            isOpen ? "sm:opacity-60 sm:pointer-events-none" : "sm:opacity-100"
          } md:opacity-100`}
        >
          {children}
        </main>
      </div>
    </main>
  );
}
