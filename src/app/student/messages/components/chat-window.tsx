import Image from "next/image";
import type { ActiveChat } from "./chat-shell";
import Group from "@/assets/icons/group.svg";
import Dots from "@/assets/icons/dots.svg";
import Send from "@/assets/icons/send.svg";
import LeftArrow from "@/assets/icons/left-arrow.svg";
import { MessageBoxLeft, MessageBoxRight } from "./message-box";

export default function ChatWindow({
  chat,
  onBack,
}: {
  chat: ActiveChat | null;
  onBack?: () => void;
}) {
  if (!chat) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Select a chat
      </div>
    );
  }

  const chat_messages = [
    {
      id: 1312,
      user_id: 2,
      avatar: "https://avatar.iran.liara.run/public/35",
      name: "Sarah Smith",
      message:
        "Hello everyone! I've uploaded the initial diagrams for the project to our shared folder. Can you all take a look?",
      timestamp: "10:00 AM",
      status: "Delivered",
    },
    {
      id: 8767,
      user_id: 5,
      avatar: "https://avatar.iran.liara.run/public/86",
      name: "Alex Johnson",
      message:
        "Thanks Sarah! I will check them out right now and leave some comments if I see anything.",
      timestamp: "10:02 AM",
      status: "Delivered",
    },
    {
      id: 3242,
      user_id: 3,
      avatar: "https://avatar.iran.liara.run/public/52",
      name: "Alan Grant",
      message:
        "Looks good to me. Just make sure we follow the professor's naming convention for the files.",
      timestamp: "10:05 AM",
      status: "Delivered",
    },
    {
      id: 5765,
      user_id: 5,
      avatar: "https://avatar.iran.liara.run/public/86",
      name: "Alex Johnson",
      message: "I also attached the file for you to check.",
      timestamp: "10:10 AM",
      status: "Failed",
    },
  ];

  const CURRENT_USER_ID = 5;

  return (
    <section className="flex flex-col h-full bg-gray-50 overflow-scroll">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-[#f0f2f4] shadow-sm sticky top-0 z-10">
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden p-2 -ml-1.5 text-[#616f89]"
          >
            <LeftArrow className="size-6" />
          </button>
        )}
        {chat?.isGroup ? (
          <div className="flex items-center justify-center bg-[#135BEC]/10 text-[#135BEC] rounded-full size-10 shrink-0">
            <Group className="size-7" />
          </div>
        ) : (
          <div className="flex items-center justify-center bg-[#135BEC]/10 text-[#135BEC] rounded-full size-10 shrink-0">
            <Image
              src={chat?.avatar}
              width={100}
              height={100}
              alt="logo"
              className="object-cover overflow-hidden"
            />
          </div>
        )}
        <div>
          <p className="text-[#111318] text-base font-bold leading-tight">
            {chat?.name}
          </p>
          <p className="text-[#135BEC] text-xs font-medium leading-none mt-0.5">
            {chat?.course}
          </p>
        </div>
        <Dots className="size-5 ml-auto text-[#616f89]" />
      </header>
      {/* Messages Box*/}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        <div className="flex justify-center">
          <span className="text-xs font-medium text-[#616f89] bg-[#f0f2f4] px-3 py-1 rounded-full">
            Today, 10:00 AM
          </span>
        </div>
        {chat_messages?.map((message) => {
          return message?.user_id !== CURRENT_USER_ID ? (
            <MessageBoxLeft message={message} key={message?.id} />
          ) : (
            <MessageBoxRight message={message} key={message?.id} />
          );
        })}
      </div>

      {/* Input */}
      <footer className="p-4 bg-white border-t border-[#f0f2f4]">
        <div className="flex gap-2 max-w-240 mx-auto">
          <input
            placeholder="Type a message…"
            className="flex-1 max-h-32 rounded-3xl bg-[#f0f2f4] px-4 py-2 text-[#111318] placeholder:text-[#616f89] transition-all outline-0 focus:ring-2 focus:ring-[#135BEC]/20"
          />

          <button className="bg-[#135BEC] hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-colors flex items-center justify-center shrink-0">
            <Send className="size-5" />
          </button>
        </div>
      </footer>
    </section>
  );
}
