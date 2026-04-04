"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageBoxLeft, MessageBoxRight } from "./message-box";
import { useSearchParams } from "next/navigation";
import { getChatDateLabel } from "./utils.messages";
import { pusherClient } from "@/lib/pusher.init";

export interface ChatMessagesProps {
  id: string;
  createdAt: Date;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
}

export default function ChatMessages({
  initialChatMessages,
  userId,
}: {
  initialChatMessages: ChatMessagesProps[];
  userId: string;
}) {
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chat-id");
  const [chatMessages, setChatMessages] =
    useState<ChatMessagesProps[]>(initialChatMessages);

  const groupedMessages = useMemo(() => {
    return chatMessages.reduce(
      (groups: Record<string, ChatMessagesProps[]>, message) => {
        const label = getChatDateLabel(new Date(message.createdAt));
        if (!groups[label]) groups[label] = [];
        groups[label].push(message);
        return groups;
      },
      {},
    );
  }, [chatMessages]);

  useEffect(() => {
    if (!chatId) return;

    const channel = pusherClient.subscribe(`chat-${chatId}`);

    channel.bind("new-message", (newMessage: ChatMessagesProps) => {
      setChatMessages((prev) => [newMessage, ...prev]);
    });

    return () => {
      pusherClient.unsubscribe(`chat-${chatId}`);
    };
  }, [chatId]);

  return (
    <div className="flex-1 flex flex-col-reverse overflow-y-auto p-4 md:p-6">
      {Object.entries(groupedMessages).map(([label, message]) => {
        return (
          <div key={label} className="flex flex-col-reverse gap-4">
            {message.map((message) => {
              return message?.sender.id !== userId ? (
                <MessageBoxLeft key={message.id + userId} message={message} />
              ) : (
                <MessageBoxRight key={message.id + userId} message={message} />
              );
            })}
            <div className="flex justify-center my-4 ">
              <span className="text-xs font-medium text-[#616f89] bg-[#f0f2f4] px-3 py-1 rounded-full">
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
