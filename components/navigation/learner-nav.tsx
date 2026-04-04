"use client";

import Image from "next/image";
import Burger from "@/assets/icons/burger.svg";
import { SessionData } from "@/lib/auth/auth";

export default function LearnerNav({
  isOpen,
  setIsOpen,
  session,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  session: SessionData;
}) {
  const LOGO_URL =
    "https://epearlacademy.com/pluginfile.php/1/theme_alpha/alphasettingsimgs/0/finallogo.png";

  const DEFAULT_AVATAR =
    "https://lms-mvp-test.s3.eu-west-1.amazonaws.com/profileImage/avataaars(6).png";

  return (
    <header className="h-16 flex justify-between items-center border-b border-[#f0f2f4] bg-white px-4 shadow-md">
      <div className="flex items-center gap-3">
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          <Burger className="size-8" />
        </button>
        <Image
          src={LOGO_URL}
          width={100}
          loading="eager"
          height={100}
          alt="Epearl Academy Logo"
        />
      </div>
      <div className="flex items-center gap-6">
        <button className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="200"
            height="200"
            viewBox="0 0 24 24"
            className="size-6 text-[#616f89]"
          >
            <path
              fill="currentColor"
              d="M10.146 3.248a2 2 0 0 1 3.708 0A7.003 7.003 0 0 1 19 10v4.697l1.832 2.748A1 1 0 0 1 20 19h-4.535a3.501 3.501 0 0 1-6.93 0H4a1 1 0 0 1-.832-1.555L5 14.697V10c0-3.224 2.18-5.94 5.146-6.752zM10.586 19a1.5 1.5 0 0 0 2.829 0h-2.83zM12 5a5 5 0 0 0-5 5v5a1 1 0 0 1-.168.555L5.869 17H18.13l-.963-1.445A1 1 0 0 1 17 15v-5a5 5 0 0 0-5-5z"
            />
          </svg>
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-[#111318]">{session.name}</p>
            <p className="text-sm text[#616f89]">Learner ID: {session.role}</p>
          </div>
          <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-gray-100 shadow-sm">
            <Image
              src={session.avatar ?? DEFAULT_AVATAR}
              alt={`${session.name}'s avatar`}
              fill
              sizes="40px"
              className="object-cover transition-transform hover:scale-110"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
