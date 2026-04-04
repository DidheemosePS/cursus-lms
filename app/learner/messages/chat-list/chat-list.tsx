"use client";

import Group from "@/assets/icons/group.svg";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { use, useEffect, useMemo, useState, useTransition } from "react";
import { pusherClient } from "@/lib/pusher.init";
import { markAsRead, startDirectChat } from "./actions";
import { ChatRow } from "./components/chat-row";
import { UnreadBadge } from "./components/unread-badge";
import { Timestamp } from "./components/timestamp";
import { SectionLabel } from "./components/section-label";

// Types

interface ConversationItem {
  id: string;
  type: "DIRECT" | "GROUP";
  courseId: string;
  lastMessageId: string | null;
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
  course: { title: string };
  members: {
    id: string;
    conversationId: string;
    userId: string;
    unreadCount: number;
    lastReadAt: Date;
    user: {
      id: string;
      name: string;
      avatar: string;
    };
  }[];
  latestMessage: { content: string; createdAt: Date } | null;
}

interface SuggestedInstructor {
  id: string;
  name: string;
  avatar: string;
  instructedCourses: {
    course: { id: string; title: string };
  }[];
}

const DEFAULT_AVATAR =
  "https://lms-mvp-test.s3.eu-west-1.amazonaws.com/profileImage/avataaars(6).png";

// Component
export default function ChatList({
  getChatListPromise,
  getSuggestedInstructorsPromise,
  userId,
}: {
  getChatListPromise: Promise<ConversationItem[]>;
  getSuggestedInstructorsPromise: Promise<SuggestedInstructor[]>;
  userId: string;
}) {
  const chatIdParams = useSearchParams();
  const chatId = chatIdParams.get("chat-id");

  const initialData = use(getChatListPromise);
  const suggestedInstructorsRaw = use(getSuggestedInstructorsPromise);

  const [chats, setChats] = useState(initialData);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Format all conversations
  const formattedChats = useMemo(() => {
    return chats.map((chat) => {
      const myData = chat.members.find((m) => m.user.id === userId);
      const others = chat.members.filter((m) => m.user.id !== userId);

      return {
        id: chat.id,
        type: chat.type,
        latestMessage: chat.latestMessage,
        lastMessageAt: chat.lastMessageAt,
        unreadCount: myData?.unreadCount || 0,
        chatName:
          chat.type === "DIRECT" ? others[0]?.user.name : chat.course.title,
        chatImage: chat.type === "DIRECT" ? others[0]?.user.avatar : "",
        participants: others.map((o) => o.user),
      };
    });
  }, [chats, userId]);

  // Split into sections
  const groupChats = useMemo(
    () => formattedChats.filter((c) => c.type === "GROUP"),
    [formattedChats],
  );

  const directChats = useMemo(() => {
    const directs = formattedChats.filter((c) => c.type === "DIRECT");
    // Unread bubbles to top, then sort by last message time
    return directs.sort((a, b) => {
      if (b.unreadCount !== a.unreadCount) return b.unreadCount - a.unreadCount;
      return (
        new Date(b.lastMessageAt).getTime() -
        new Date(a.lastMessageAt).getTime()
      );
    });
  }, [formattedChats]);

  // Remove suggested instructors that already have a direct conversation
  const chattedInstructorIds = useMemo(
    () =>
      new Set(
        directChats.flatMap((chat) => chat.participants.map((p) => p.id)),
      ),
    [directChats],
  );

  const suggestedInstructors = useMemo(
    () =>
      suggestedInstructorsRaw.filter((i) => !chattedInstructorIds.has(i.id)),
    [suggestedInstructorsRaw, chattedInstructorIds],
  );

  // Pusher real-time updates
  useEffect(() => {
    if (!userId) return;

    const channel = pusherClient.subscribe(`user-${userId}`);

    channel.bind(
      "unread-increment",
      async (data: {
        conversationId: string;
        latestMessage: { content: string; createdAt: Date };
      }) => {
        if (data.conversationId !== chatId) {
          setChats((prev) =>
            prev.map((chat) => {
              if (chat.id === data.conversationId) {
                return {
                  ...chat,
                  latestMessage: {
                    content: data.latestMessage.content,
                    createdAt: data.latestMessage.createdAt,
                  },
                  members: chat.members.map((m) =>
                    m.user.id === userId
                      ? { ...m, unreadCount: m.unreadCount + 1 }
                      : m,
                  ),
                };
              }
              return chat;
            }),
          );
          return;
        }
        await markAsRead(data.conversationId);
      },
    );

    return () => {
      pusherClient.unsubscribe(`user-${userId}`);
    };
  }, [chatId, userId]);

  // Mark as read on open
  async function handleChatSelect(selectedChatId: string) {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === selectedChatId) {
          return {
            ...chat,
            members: chat.members.map((m) =>
              m.userId === userId ? { ...m, unreadCount: 0 } : m,
            ),
          };
        }
        return chat;
      }),
    );
    await markAsRead(selectedChatId);
  }

  function handleStartChat(instructorId: string, courseId: string) {
    setPendingId(instructorId);
    startTransition(async () => {
      await startDirectChat(instructorId, courseId);
      // redirect() inside the action navigates away —
      // setPendingId(null) only runs if redirect didn't fire
      setPendingId(null);
    });
  }

  // Render
  return (
    <aside
      className={`${chatId && "hidden"} @3xl:block h-full flex flex-col bg-white border-r border-[#f0f2f4] overflow-hidden`}
    >
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-[#f0f2f4] p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#111318]">Messages</h1>
      </header>

      {/* Search */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Search by instructor or course"
          className="w-full rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all border border-transparent focus:border-blue-500"
        />
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto">
        {/* ── Section 1: Group Chats ── */}
        {groupChats.length > 0 && (
          <div>
            <SectionLabel label="Groups" />
            {groupChats.map((chat) => (
              <ChatRow
                key={chat.id}
                chatId={chat.id}
                activeChatId={chatId}
                unreadCount={chat.unreadCount}
                lastMessage={chat.latestMessage?.content ?? null}
                lastMessageAt={chat.latestMessage?.createdAt ?? null}
                onSelect={handleChatSelect}
              >
                {/* Group avatar */}
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
          </div>
        )}

        {/* ── Section 2: Direct Chat History ── */}
        {directChats.length > 0 && (
          <div>
            <SectionLabel label="Recent" />
            {directChats.map((chat) => (
              <ChatRow
                key={chat.id}
                chatId={chat.id}
                activeChatId={chatId}
                unreadCount={chat.unreadCount}
                lastMessage={chat.latestMessage?.content ?? null}
                lastMessageAt={chat.latestMessage?.createdAt ?? null}
                onSelect={handleChatSelect}
              >
                {/* Instructor avatar */}
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
          </div>
        )}

        {/* ── Section 3: Suggested Instructors (no conversation yet) ── */}
        {suggestedInstructors.length > 0 && (
          <section>
            <SectionLabel label="Start a conversation" />
            <p className="px-4 pb-2 text-xs text-[#616f89]">
              Send a message to your instructors
            </p>
            {suggestedInstructors.map((instructor) => {
              const courseId = instructor.instructedCourses[0]?.course.id ?? "";
              const isThisPending = isPending && pendingId === instructor.id;

              return (
                <button
                  key={instructor.id}
                  onClick={() => handleStartChat(instructor.id, courseId)}
                  disabled={isPending}
                  className="group w-full flex gap-3 px-4 py-4 border-l-4 border-transparent text-left transition-colors hover:bg-[#F6F6F8] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-gray-100 shadow-sm">
                    <Image
                      src={instructor.avatar || DEFAULT_AVATAR}
                      alt={`${instructor.name}'s avatar`}
                      fill
                      sizes="48px"
                      className="object-cover transition-transform group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-1 flex-col min-w-0 justify-center">
                    <p className="text-sm font-semibold text-[#111318] truncate leading-tight">
                      {instructor.name}
                    </p>
                    <p className="text-xs text-[#616f89] truncate mt-0.5">
                      {instructor.instructedCourses[0]?.course.title ?? ""}
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
        )}

        {/* Empty state */}
        {groupChats.length === 0 &&
          directChats.length === 0 &&
          suggestedInstructors.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-center px-6">
              <p className="text-sm text-[#616f89]">No conversations yet.</p>
              <p className="text-xs text-[#9ca3af] mt-1">
                Enroll in a course to start chatting with instructors.
              </p>
            </div>
          )}
      </div>
    </aside>
  );
}
