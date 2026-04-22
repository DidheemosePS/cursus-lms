"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChatMessageItem } from "@/components/chat/types/chat.types";
import { getPusherClient } from "@/lib/pusher.init";

export function useChatMessages(initialMessages: ChatMessageItem[]) {
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chat-id");

  const [chatMessages, setChatMessages] =
    useState<ChatMessageItem[]>(initialMessages);

  useEffect(() => {
    if (!chatId) return;

    const pusherClient = getPusherClient();

    const channel = pusherClient.subscribe(`chat-${chatId}`);

    channel.bind("new-message", (newMessage: ChatMessageItem) => {
      setChatMessages((prev) => [newMessage, ...prev]);
    });

    return () => {
      pusherClient.unsubscribe(`chat-${chatId}`);
    };
  }, [chatId]);

  return { chatMessages };
}
