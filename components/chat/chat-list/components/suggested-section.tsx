import Image from "next/image";
import { SectionLabel } from "./section-label";
import { SuggestedItem } from "@/components/chat/types/chat.types";

const DEFAULT_AVATAR =
  "https://lms-mvp-test.s3.eu-west-1.amazonaws.com/profileImage/avataaars.png";

interface SuggestedSectionProps {
  items: SuggestedItem[];
  sectionLabel: string;
  sectionHint: string;
  isPending: boolean;
  pendingId: string | null;
  onStartChat: (targetUserId: string, courseId: string) => void;
}

export function SuggestedSection({
  items,
  sectionLabel,
  sectionHint,
  isPending,
  pendingId,
  onStartChat,
}: SuggestedSectionProps) {
  if (items.length === 0) return null;

  return (
    <section>
      <SectionLabel label={sectionLabel} />
      <p className="px-4 pb-2 text-xs text-[#616f89]">{sectionHint}</p>
      {items.map((item) => {
        const isThisPending = isPending && pendingId === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onStartChat(item.id, item.courseId)}
            disabled={isPending}
            className="group w-full flex gap-3 px-4 py-4 border-l-4 border-transparent text-left transition-colors hover:bg-[#F6F6F8] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-gray-100 shadow-sm">
              <Image
                src={item.avatar || DEFAULT_AVATAR}
                alt={`${item.name}'s avatar`}
                fill
                sizes="48px"
                className="object-cover transition-transform group-hover:scale-110"
              />
            </div>
            <div className="flex flex-1 flex-col min-w-0 justify-center">
              <p className="text-sm font-semibold text-[#111318] truncate leading-tight">
                {item.name}
              </p>
              <p className="text-xs text-[#616f89] truncate mt-0.5">
                {item.subtitle ?? ""}
              </p>
            </div>
            <div className="self-center shrink-0">
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                  isThisPending
                    ? "text-blue-400 bg-blue-50"
                    : "text-blue-500 bg-blue-50 group-hover:bg-blue-100"
                }`}
              >
                {isThisPending ? "Opening…" : "Message"}
              </span>
            </div>
          </button>
        );
      })}
    </section>
  );
}
