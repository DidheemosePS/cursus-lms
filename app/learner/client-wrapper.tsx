"use client";

import { Activity, ReactNode, useState } from "react";
import Sidebar from "@/components/navigation/side-bar";
import LearnerNav from "@/components/navigation/learner-nav";
import Dashboard from "@/assets/icons/dashboard.svg";
import MyCourse from "@/assets/icons/books.svg";
import Message from "@/assets/icons/messages.svg";
import Settings from "@/assets/icons/settings.svg";
import Question from "@/assets/icons/question.svg";
import type { NAV_LINK } from "@/components/navigation/side-bar";
import type { SessionData } from "@/lib/auth/auth";

interface ClientWrapperProps {
  children: ReactNode;
  session: SessionData;
}

export default function Page({ children, session }: ClientWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);

  const NAV_LINKS: NAV_LINK[] = [
    {
      id: 1,
      href: "/learner",
      label: "Overview",
      icon: Dashboard,
      section: "top",
    },
    {
      id: 2,
      href: "/learner/my-courses",
      label: "My Courses",
      icon: MyCourse,
      section: "top",
    },
    {
      id: 3,
      href: "/learner/messages",
      label: "Messages",
      icon: Message,
      section: "top",
    },
    {
      id: 4,
      href: "/learner/settings",
      label: "Settings",
      icon: Settings,
      section: "bottom",
    },
    {
      id: 5,
      href: "/learner/help-support",
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
