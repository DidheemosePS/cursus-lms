"use server";

import { sendMessage } from "@/dal/learners/message/chat.dal";
import { getSession } from "@/lib/auth/auth";
import { pusher } from "@/lib/pusher.init";

export async function handleChatInput(chatId: string, formData: FormData) {
  const { userId } = await getSession();

  const content = formData.get("chat-input")?.toString();

  if (!content || !chatId || !userId) return;

  const sendMessageRes = await sendMessage(chatId, content);

  if (!sendMessageRes) return;

  pusher.trigger(`chat-${chatId}`, "new-message", sendMessageRes.newMessage);

  const notifications = sendMessageRes.members.map((member) => {
    pusher.trigger(`user-${member.userId}`, "unread-increment", {
      conversationId: chatId,
      latestMessage: {
        content: sendMessageRes.newMessage.content,
        createdAt: sendMessageRes.newMessage.createdAt,
      },
    });
  });

  await Promise.all(notifications);
}
