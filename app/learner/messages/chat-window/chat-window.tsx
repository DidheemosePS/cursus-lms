import Image from "next/image";
import Group from "@/assets/icons/group.svg";
import Dots from "@/assets/icons/dots.svg";
import Send from "@/assets/icons/send.svg";
import LeftArrow from "@/assets/icons/left-arrow.svg";
import Link from "next/link";
import { getSession } from "@/lib/auth/auth";
import ChatMessages from "./chat-messages";
import { getChatMessages } from "@/dal/learners/message/chat.dal";
import { redirect } from "next/navigation";
import { handleChatInput } from "./action";

export const dynamic = "force-dynamic";

export default async function ChatWindow({
  chatId,
}: {
  chatId: string | undefined;
}) {
  if (!chatId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Select a chat
      </div>
    );
  }

  const { userId } = await getSession();

  if (!userId) redirect("/login");

  const rawMessages = await getChatMessages(chatId);

  const isGroup = rawMessages?.type === "GROUP";

  return (
    <section className="flex flex-col h-full bg-gray-50 overflow-scroll">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-[#f0f2f4] shadow-sm sticky top-0 z-10">
        <Link
          href="/learner/messages"
          className="@3xl:hidden p-2 -ml-1.5 text-[#616f89] transition-colors hover:bg-gray-100 rounded-full"
        >
          <LeftArrow className="size-6" />
        </Link>
        {isGroup ? (
          <div className="flex items-center justify-center bg-blue-100 text-blue-500 rounded-full size-10 shrink-0">
            <Group className="size-7" />
          </div>
        ) : (
          <div className="flex items-center justify-center bg-blue-100 text-blue-500 rounded-full size-10 shrink-0 overflow-hidden">
            <Image
              src={rawMessages?.members[0].user.avatar ?? ""}
              alt="avatar"
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {isGroup ? (
          <div>
            <p className="text-[#111318] text-base font-bold leading-tight">
              {rawMessages?.course.title}
            </p>
            <div className="flex gap-1">
              {rawMessages.members.map((m, index) => {
                return (
                  <p
                    key={m.user.id}
                    className="text-[#616f89] text-xs font-medium leading-none mt-0.5"
                  >
                    {m.user.name}
                    {index < rawMessages.members.length - 1 && ","}
                  </p>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            <p className="text-[#111318] text-base font-bold leading-tight">
              {rawMessages?.members[0].user.name}
            </p>
            <p className="text-blue-500 text-xs font-medium leading-none mt-0.5">
              {rawMessages?.course.title}
            </p>
          </div>
        )}
        <button className="p-2 ml-auto text-[#616f89] transition-colors hover:bg-gray-100 rounded-full">
          <Dots className="size-6" />
        </button>
      </header>
      {/* Messages Box*/}
      {rawMessages?.messages && userId && (
        <ChatMessages
          key={chatId}
          initialChatMessages={rawMessages.messages}
          userId={userId}
        />
      )}

      {/* Input */}
      <footer className="p-4 bg-white border-t border-[#f0f2f4]">
        <form
          action={handleChatInput.bind(null, chatId)}
          className="flex gap-2 max-w-240 mx-auto"
          autoComplete="off"
        >
          <input
            name="chat-input"
            placeholder="Type a message…"
            className="flex-1 max-h-32 rounded-3xl bg-[#f0f2f4] px-4 py-2 text-[#111318] placeholder:text-[#616f89] transition-all outline-0 focus:ring-2 focus:ring-blue-200"
          />

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition-colors flex items-center justify-center shrink-0"
          >
            <Send className="size-5" />
          </button>
        </form>
      </footer>
    </section>
  );
}
