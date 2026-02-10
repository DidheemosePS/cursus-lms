import Edit from "@/assets/icons/edit.svg";
import Group from "@/assets/icons/group.svg";
import Image from "next/image";
import type { ActiveChat } from "./chat-shell";

export default function ChatList({
  activeChat,
  onSelect,
}: {
  activeChat: ActiveChat | null;
  onSelect: (activeChat: ActiveChat) => void;
}) {
  const chats = [
    {
      id: 1,
      avatar:
        "https://testingbot.com/free-online-tools/random-avatar/100?img=8",
      name: "CS101 Project Group",
      course: "Computer Science 101",
      recent_message: "Sarah: I've uploaded the diagrams...",
      read: true,
      unread_messages: 0,
      isGroup: true,
    },
    {
      id: 2,
      avatar:
        "https://testingbot.com/free-online-tools/random-avatar/100?img=4",
      name: "Dr. Sarah Smith",
      course: "Biology 101",
      recent_message: "Hi Dr. Smith, I am just finishing the...",
      read: false,
      unread_messages: 1,
      isGroup: false,
    },
    {
      id: 3,
      avatar:
        "https://testingbot.com/free-online-tools/random-avatar/100?img=5",
      name: "Prof. Alan Grant",
      course: "Paleontology",
      recent_message: "Please review the syllabus for next week...",
      read: true,
      unread_messages: 0,
      isGroup: false,
    },
    {
      id: 4,
      avatar:
        "https://testingbot.com/free-online-tools/random-avatar/100?img=7",
      name: "Ms. Valerie Frizzle",
      course: "Science Lab",
      recent_message: "Field trip permission slips are due...",
      read: false,
      unread_messages: 3,
      isGroup: false,
    },
  ];

  return (
    <aside className="h-full flex flex-col bg-white border-r border-[#f0f2f4] overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-[#f0f2f4] p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#111318]">Messages</h1>
        <button className="p-2 rounded-full text-[#135BEC] hover:bg-[#135BEC]/10">
          <Edit className="size-5" />
        </button>
      </header>

      {/* Search */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Search by instructor or course"
          className="w-full h-10 rounded-lg bg-gray-100 px-3 text-sm placeholder:text-[#616f89] outline-none focus:ring-2 focus:ring-[#135BEC]/20"
        />
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => {
          const isActive = activeChat?.id === chat.id;

          return (
            <button
              key={chat.id}
              onClick={() =>
                onSelect({
                  id: chat.id,
                  avatar: chat.avatar,
                  name: chat.name,
                  course: chat.course,
                  isGroup: chat.isGroup,
                })
              }
              className={`w-full flex gap-3 px-4 py-4 border-l-4 text-left transition-colors
                ${
                  isActive
                    ? "border-[#135BEC] bg-[#135BEC]/5"
                    : "border-transparent hover:bg-[#F6F6F8]"
                }
              `}
            >
              {/* Avatar */}
              {chat.isGroup ? (
                <div className="size-12 rounded-full bg-[#135BEC]/10 text-[#135BEC] flex items-center justify-center shrink-0">
                  <Group className="size-6" />
                </div>
              ) : (
                <div className="size-12 rounded-full overflow-hidden shrink-0 border border-[#f0f2f4]">
                  <Image
                    src={chat.avatar}
                    alt=""
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Text */}
              <div className="flex flex-1 flex-col min-w-0">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-semibold text-[#111318] truncate leading-tight">
                    {chat.name}
                  </p>
                  <span className="text-[10px] font-medium text-[#616f89] whitespace-nowrap leading-none">
                    10:05 AM
                  </span>
                </div>

                <p className="text-xs font-medium text-[#135BEC] truncate mb-1 leading-tight">
                  {chat.course}
                </p>

                <div className="flex justify-between items-center">
                  <p
                    className={`text-sm truncate pr-2 ${
                      chat.read
                        ? "text-[#616f89]"
                        : "font-medium text-[#111318]"
                    }`}
                  >
                    {chat.recent_message}
                  </p>

                  {!chat.read && chat.unread_messages && (
                    <span className="min-w-5 h-5 px-1.5 rounded-full bg-[#135BEC] text-white text-[10px] font-bold flex items-center justify-center">
                      {chat.unread_messages}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
