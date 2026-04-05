import Image from "next/image";
import Link from "next/link";
import Group from "@/assets/icons/group.svg";
import Dots from "@/assets/icons/dots.svg";
import LeftArrow from "@/assets/icons/left-arrow.svg";

interface WindowHeaderProps {
  isGroup: boolean;
  baseRoute: string;
  courseTitle: string;
  members: { user: { id: string; name: string; avatar: string } }[];
}

export function WindowHeader({
  isGroup,
  baseRoute,
  courseTitle,
  members,
}: WindowHeaderProps) {
  return (
    <header className="flex items-center gap-3 px-4 py-3 border-b border-[#f0f2f4] shadow-sm sticky top-0 z-10 bg-white">
      {/* Back button — mobile only */}
      <Link
        href={baseRoute}
        className="@3xl:hidden p-2 -ml-1.5 text-[#616f89] transition-colors hover:bg-gray-100 rounded-full"
      >
        <LeftArrow className="size-6" />
      </Link>

      {/* Avatar */}
      {isGroup ? (
        <div className="flex items-center justify-center bg-blue-100 text-blue-500 rounded-full size-10 shrink-0">
          <Group className="size-7" />
        </div>
      ) : (
        <div className="size-10 shrink-0 rounded-full overflow-hidden">
          <Image
            src={members[0]?.user.avatar ?? ""}
            alt={`${members[0]?.user.name}'s avatar`}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Name / participants */}
      {isGroup ? (
        <div className="min-w-0">
          <p className="text-[#111318] text-base font-bold leading-tight truncate">
            {courseTitle}
          </p>
          <div className="flex gap-1 flex-wrap">
            {members.map((m, index) => (
              <p
                key={m.user.id}
                className="text-[#616f89] text-xs font-medium leading-none mt-0.5"
              >
                {m.user.name}
                {index < members.length - 1 && ","}
              </p>
            ))}
          </div>
        </div>
      ) : (
        <div className="min-w-0">
          <p className="text-[#111318] text-base font-bold leading-tight truncate">
            {members[0]?.user.name}
          </p>
          <p className="text-blue-500 text-xs font-medium leading-none mt-0.5 truncate">
            {courseTitle}
          </p>
        </div>
      )}

      {/* Options */}
      <button className="p-2 ml-auto shrink-0 text-[#616f89] transition-colors hover:bg-gray-100 rounded-full">
        <Dots className="size-6" />
      </button>
    </header>
  );
}
