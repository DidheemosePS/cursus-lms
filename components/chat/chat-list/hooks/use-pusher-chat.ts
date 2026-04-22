import { useEffect } from "react";
import { markAsRead } from "@/actions/chat.actions";
import { ConversationItem } from "@/components/chat/types/chat.types";
import { getPusherClient } from "@/lib/pusher.init";

export function usePusherChat(
  userId: string,
  chatId: string | null,
  setChats: React.Dispatch<React.SetStateAction<ConversationItem[]>>,
) {
  useEffect(() => {
    if (!userId) return;

    const pusherClient = getPusherClient();

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
              if (chat.id !== data.conversationId) return chat;
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
  }, [chatId, userId, setChats]);
}
