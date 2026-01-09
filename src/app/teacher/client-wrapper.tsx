"use client";

import { Activity, useState } from "react";
import Sidebar from "@/components/navigation/side-bar";
import StudentNav from "@/components/navigation/student-nav";
import Dashboard from "@/assets/icons/dashboard.svg";
import MyCourse from "@/assets/icons/books.svg";
import Message from "@/assets/icons/messages.svg";
import Settings from "@/assets/icons/settings.svg";
import Question from "@/assets/icons/question.svg";
import Group from "@/assets/icons/group.svg";
import Submission from "@/assets/icons/inbox.svg";

import type { NAV_LINKS } from "@/components/navigation/side-bar";

export default function Page({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const NAV_LINKS: NAV_LINKS[] = [
    {
      id: 1,
      href: "/teacher",
      label: "Overview",
      icon: Dashboard,
      section: "top",
    },
    {
      id: 2,
      href: "/teacher/submissions",
      label: "Submissions",
      icon: Submission,
      section: "top",
    },
    {
      id: 3,
      href: "/teacher/my-students",
      label: "My Students",
      icon: Group,
      section: "top",
    },
    {
      id: 4,
      href: "/teacher/my-courses",
      label: "My Courses",
      icon: MyCourse,
      section: "top",
    },
    {
      id: 5,
      href: "/teacher/messages",
      label: "Messages",
      icon: Message,
      section: "top",
    },
    {
      id: 6,
      href: "/teacher/settings",
      label: "Settings",
      icon: Settings,
      section: "bottom",
    },
    {
      id: 7,
      href: "/teacher/help-support",
      label: "Help and Support",
      icon: Question,
      section: "bottom",
    },
  ];

  return (
    <main className="h-full overflow-y-auto">
      <div className="fixed top-0 z-50 w-full">
        <StudentNav isOpen={isOpen} setIsOpen={setIsOpen} />
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
