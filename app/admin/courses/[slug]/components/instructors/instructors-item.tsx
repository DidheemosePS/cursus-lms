import { Instructor } from "./instructors";
import Image from "next/image";
import Close from "@/assets/icons/close.svg";

export interface InstructorsItemProps {
  instructor: Instructor;
  action: "add" | "remove";
  isAssigned?: boolean;
  onClick: () => void;
}

export default function InstructorsItem({
  instructor,
  action,
  isAssigned,
  onClick,
}: InstructorsItemProps) {
  const isAddAction = action === "add";
  const buttonColor = isAddAction
    ? "text-gray-400 hover:text-blue-500 hover:bg-blue-50"
    : "text-gray-400 hover:text-red-500 hover:bg-red-50";
  const isRotated = isAddAction ? "rotate-45" : "";

  const AVATAR_URL =
    "https://testingbot.com/free-online-tools/random-avatar/100?img=6";

  return (
    <div className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group">
      <div className="flex items-center gap-3">
        <Image
          src={instructor.avatar ?? AVATAR_URL}
          width={32}
          height={32}
          alt={instructor.name}
          className="rounded-full bg-white overflow-hidden"
        />
        <div>
          <p className="text-sm font-bold text-gray-900 leading-tight">
            {instructor.name}
          </p>
          <p className="text-xs text-gray-500">{instructor.role}</p>
        </div>
      </div>

      <button
        onClick={onClick}
        disabled={isAssigned}
        className={`p-1 rounded transition-all ${buttonColor} disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label={isAddAction ? "Add instructor" : "Remove instructor"}
      >
        <Close className={`size-4 ${isRotated}`} />
      </button>
    </div>
  );
}
