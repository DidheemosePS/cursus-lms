"use client";

import { useMemo } from "react";
import { MessageBoxLeft, MessageBoxRight } from "./message-box";
import { DateDivider } from "./date-divider";
import { useChatMessages } from "../hooks/use-chat-messages";
import { getChatDateLabel } from "../utils/chat-date-label";
import { ChatMessageItem } from "@/components/chat/types/chat.types";

export default function ChatMessages({
  initialChatMessages,
  userId,
}: {
  initialChatMessages: ChatMessageItem[];
  userId: string;
}) {
  const { chatMessages } = useChatMessages(initialChatMessages);

  const groupedMessages = useMemo(() => {
    return chatMessages.reduce(
      (groups: Record<string, ChatMessageItem[]>, message) => {
        const label = getChatDateLabel(new Date(message.createdAt));
        if (!groups[label]) groups[label] = [];
        groups[label].push(message);
        return groups;
      },
      {},
    );
  }, [chatMessages]);

  return (
    <div className="flex-1 flex flex-col-reverse overflow-y-auto p-4 md:p-6">
      {Object.entries(groupedMessages).map(([label, messages]) => (
        <div key={label} className="flex flex-col-reverse gap-4">
          {messages.map((message) =>
            message.sender.id !== userId ? (
              <MessageBoxLeft key={message.id + userId} message={message} />
            ) : (
              <MessageBoxRight key={message.id + userId} message={message} />
            ),
          )}
          <DateDivider label={label} />
        </div>
      ))}
    </div>
  );
}
