import Link from "next/link";

export function ChatRow({
  chatId,
  activeChatId,
  unreadCount,
  onSelect,
  children,
}: {
  chatId: string;
  activeChatId: string | null;
  unreadCount: number;
  lastMessage: string | null;
  lastMessageAt: Date | string | null;
  onSelect: (id: string) => Promise<void>;
  children: React.ReactNode;
}) {
  const isActive = chatId === activeChatId;
  return (
    <Link
      href={`/learner/messages?chat-id=${chatId}`}
      onClick={() => onSelect(chatId)}
      className={`group w-full flex gap-3 px-4 py-4 border-l-4 text-left transition-colors
        ${isActive ? "border-blue-500 bg-blue-100" : "border-transparent hover:bg-[#F6F6F8]"}
        ${unreadCount > 0 && !isActive ? "bg-blue-50/40" : ""}
      `}
    >
      {children}
    </Link>
  );
}
