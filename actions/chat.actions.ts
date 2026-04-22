"use server";

import { sendMessage } from "@/dal/chat/chat.dal";
import { getSession } from "@/lib/auth/auth";
import prisma from "@/lib/prisma.init";
import { getPusher } from "@/lib/pusher.init";
import { redirect } from "next/navigation";

export async function markAsRead(conversationId: string) {
  const { userId } = await getSession();
  if (!conversationId || !userId) return;

  await prisma.conversationMember.update({
    where: { conversationId_userId: { conversationId, userId } },
    data: { unreadCount: 0, lastReadAt: new Date() },
  });
}

export async function handleChatInput(chatId: string, formData: FormData) {
  const { userId } = await getSession();

  const content = formData.get("chat-input")?.toString();

  if (!content || !chatId || !userId) return;

  const sendMessageRes = await sendMessage(chatId, content);

  if (!sendMessageRes) return;

  const pusher = getPusher();

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

export async function startDirectChat(
  targetId: string,
  courseId: string,
  baseRoute: string,
) {
  // targetId - id of the person chatting with, not the logged userId
  const { userId } = await getSession();
  if (!userId) redirect("/login");

  // Check if a DIRECT conversation between this learner and instructor
  // already exists under this course — avoids duplicate conversations
  const existing = await prisma.conversation.findFirst({
    where: {
      type: "DIRECT",
      courseId,
      members: { some: { userId } },
      AND: {
        members: { some: { userId: targetId } },
      },
    },
    select: { id: true },
  });

  if (existing) {
    // Already exists — just open it
    redirect(`${baseRoute}?chat-id=${existing.id}`);
  }

  // Create the conversation and add both members in one transaction
  const conversation = await prisma.$transaction(async (tx) => {
    const convo = await tx.conversation.create({
      data: {
        type: "DIRECT",
        courseId,
        members: {
          create: [{ userId }, { userId: targetId }],
        },
      },
      select: { id: true },
    });

    return convo;
  });

  redirect(`${baseRoute}?chat-id=${conversation.id}`);
}
