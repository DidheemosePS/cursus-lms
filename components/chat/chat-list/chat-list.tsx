"use client";

import Image from "next/image";
import Group from "@/assets/icons/group.svg";
import { useSearchParams } from "next/navigation";
import { use, useState, useTransition } from "react";

// Actions
import { markAsRead, startDirectChat } from "@/actions/chat.actions";

// Hooks
import { useChatList } from "./hooks/use-chat-list";
import { usePusherChat } from "./hooks/use-pusher-chat";

// Components
import { ChatRow } from "./components/chat-row";
import { UnreadBadge } from "./components/unread-badge";
import { Timestamp } from "./components/timestamp";
import { SectionLabel } from "./components/section-label";
import { SuggestedSection } from "./components/suggested-section";
import { EmptyState } from "./components/empty-state";

// Types
import { ChatListProps } from "@/components/chat/types/chat.types";

const DEFAULT_AVATAR =
  "https://lms-mvp-test.s3.eu-west-1.amazonaws.com/profileImage/avataaars.png";

export default function ChatList({
  getChatListPromise,
  getSuggestedPromise,
  userId,
  baseRoute,
  suggestedSectionLabel = "Start a conversation",
  suggestedSectionHint = "Send a message",
}: ChatListProps) {
  const chatIdParams = useSearchParams();
  const chatId = chatIdParams.get("chat-id");

  const initialData = use(getChatListPromise);
  const suggestedItems = use(getSuggestedPromise);

  const [chats, setChats] = useState(initialData);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Derived state
  const { groupChats, directChats, filteredSuggested } = useChatList(
    chats,
    suggestedItems,
    userId,
  );

  // Real-time
  usePusherChat(userId, chatId, setChats);

  // Handlers
  async function handleChatSelect(selectedChatId: string) {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === selectedChatId
          ? {
              ...chat,
              members: chat.members.map((m) =>
                m.userId === userId ? { ...m, unreadCount: 0 } : m,
              ),
            }
          : chat,
      ),
    );
    await markAsRead(selectedChatId);
  }

  function handleStartChat(targetUserId: string, courseId: string) {
    setPendingId(targetUserId);
    startTransition(async () => {
      await startDirectChat(targetUserId, courseId, baseRoute);
      setPendingId(null);
    });
  }

  const isEmpty =
    groupChats.length === 0 &&
    directChats.length === 0 &&
    filteredSuggested.length === 0;

  return (
    <aside
      className={`${chatId && "hidden"} @3xl:block h-full flex flex-col bg-white border-r border-[#f0f2f4] overflow-hidden`}
    >
      <header className="sticky top-0 z-10 bg-white border-b border-[#f0f2f4] p-4">
        <h1 className="text-2xl font-bold text-[#111318]">Chats</h1>
      </header>

      <div className="p-4">
        <input
          type="text"
          placeholder="Search by instructor or course"
          className="w-full rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all border border-transparent focus:border-blue-500"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Groups */}
        {groupChats.length > 0 && (
          <section>
            <SectionLabel label="Groups" />
            {groupChats.map((chat) => (
              <ChatRow
                key={chat.id}
                chatId={chat.id}
                activeChatId={chatId}
                unreadCount={chat.unreadCount}
                baseRoute={baseRoute}
                onSelect={handleChatSelect}
              >
                <div className="size-12 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center shrink-0">
                  <Group className="size-6" />
                </div>
                <div className="flex flex-1 flex-col min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-semibold text-[#111318] truncate leading-tight">
                      {chat.chatName}
                    </p>
                    <Timestamp date={chat.latestMessage?.createdAt ?? null} />
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-[#616f89] truncate pr-2">
                      {chat.latestMessage?.content ?? "No messages yet"}
                    </p>
                    <UnreadBadge count={chat.unreadCount} />
                  </div>
                </div>
              </ChatRow>
            ))}
          </section>
        )}

        {/* Direct history */}
        {directChats.length > 0 && (
          <section>
            <SectionLabel label="Recent" />
            {directChats.map((chat) => (
              <ChatRow
                key={chat.id}
                chatId={chat.id}
                activeChatId={chatId}
                unreadCount={chat.unreadCount}
                baseRoute={baseRoute}
                onSelect={handleChatSelect}
              >
                <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-gray-100 shadow-sm">
                  <Image
                    src={chat.chatImage || DEFAULT_AVATAR}
                    alt={`${chat.chatName}'s avatar`}
                    fill
                    sizes="48px"
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-1 flex-col min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-semibold text-[#111318] truncate leading-tight">
                      {chat.chatName}
                    </p>
                    <Timestamp date={chat.latestMessage?.createdAt ?? null} />
                  </div>
                  <div className="flex justify-between items-center">
                    <p
                      className={`text-sm truncate pr-2 ${
                        chat.unreadCount > 0
                          ? "text-[#111318] font-medium"
                          : "text-[#616f89]"
                      }`}
                    >
                      {chat.latestMessage?.content ?? "No messages yet"}
                    </p>
                    <UnreadBadge count={chat.unreadCount} />
                  </div>
                </div>
              </ChatRow>
            ))}
          </section>
        )}

        {/* Suggested */}
        <SuggestedSection
          items={filteredSuggested}
          sectionLabel={suggestedSectionLabel}
          sectionHint={suggestedSectionHint}
          isPending={isPending}
          pendingId={pendingId}
          onStartChat={handleStartChat}
        />

        {/* Empty state */}
        {isEmpty && <EmptyState />}
      </div>
    </aside>
  );
}
