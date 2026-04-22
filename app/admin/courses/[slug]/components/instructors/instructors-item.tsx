import { Instructor } from "./instructors";
import Image from "next/image";
import Close from "@/assets/icons/close.svg";

const DEFAULT_AVATAR =
  "https://lms-mvp-test.s3.eu-west-1.amazonaws.com/profileImage/avataaars.png";

export default function InstructorsItem({
  instructor,
  action,
  isAssigned,
  onClick,
}: {
  instructor: Instructor;
  action: "add" | "remove";
  isAssigned?: boolean;
  onClick: () => void;
}) {
  const isAddAction = action === "add";

  const buttonColor = isAddAction
    ? "text-gray-400 hover:text-blue-500 hover:bg-blue-50"
    : "text-gray-400 hover:text-red-500 hover:bg-red-50";

  return (
    <div className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative size-8 rounded-full overflow-hidden shrink-0 border border-gray-100">
          <Image
            src={instructor.avatar || DEFAULT_AVATAR}
            fill
            sizes="32px"
            alt={instructor.name}
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-900 leading-tight truncate">
            {instructor.name}
          </p>
          <p className="text-xs text-gray-500 capitalize">{instructor.role}</p>
        </div>
      </div>

      <button
        onClick={onClick}
        disabled={isAssigned}
        className={`p-1.5 rounded transition-all shrink-0 ml-2 ${buttonColor} disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label={isAddAction ? "Add instructor" : "Remove instructor"}
      >
        <Close className={`size-4 ${isAddAction ? "rotate-45" : ""}`} />
      </button>
    </div>
  );
}
