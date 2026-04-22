import { useMemo } from "react";
import { formatChats } from "../utils/format-chats";
import {
  ConversationItem,
  SuggestedItem,
} from "@/components/chat/types/chat.types";

export function useChatList(
  chats: ConversationItem[],
  suggestedItems: SuggestedItem[],
  userId: string,
) {
  const formattedChats = useMemo(
    () => formatChats(chats, userId),
    [chats, userId],
  );

  const groupChats = useMemo(
    () => formattedChats.filter((c) => c.type === "GROUP"),
    [formattedChats],
  );

  const directChats = useMemo(() => {
    return formattedChats
      .filter((c) => c.type === "DIRECT")
      .sort((a, b) => {
        if (b.unreadCount !== a.unreadCount)
          return b.unreadCount - a.unreadCount;
        return (
          new Date(b.lastMessageAt).getTime() -
          new Date(a.lastMessageAt).getTime()
        );
      });
  }, [formattedChats]);

  const chattedUserIds = useMemo(
    () =>
      new Set(
        directChats.flatMap((chat) => chat.participants.map((p) => p.id)),
      ),
    [directChats],
  );

  const filteredSuggested = useMemo(
    () => suggestedItems.filter((i) => !chattedUserIds.has(i.id)),
    [suggestedItems, chattedUserIds],
  );

  return { groupChats, directChats, filteredSuggested };
}
