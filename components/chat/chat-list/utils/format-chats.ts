import { ConversationItem } from "@/components/chat/types/chat.types";

export function formatChats(chats: ConversationItem[], userId: string) {
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
}
