"use server";
import { getSession } from "@/lib/auth/auth";
import prisma from "@/lib/prisma.init";

export async function getChatList() {
  const { userId } = await getSession();
  if (!userId) return [];

  return await prisma.conversation.findMany({
    where: {
      members: {
        some: { userId },
      },
    },
    include: {
      course: {
        select: { title: true },
      },
      members: {
        include: {
          user: {
            select: { id: true, name: true, avatar: true },
          },
        },
      },
      latestMessage: {
        select: {
          content: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      lastMessageAt: "desc",
    },
  });
}

export async function getSuggestedInstructors(chattedInstructorIds: string[]) {
  const { userId } = await getSession();
  if (!userId) return [];

  return await prisma.user.findMany({
    where: {
      role: "instructor",
      // Only instructors from courses this learner is actively enrolled in
      instructedCourses: {
        some: {
          course: {
            enrollments: {
              some: {
                learnerId: userId,
                enrollmentStatus: "enrolled",
              },
            },
          },
        },
      },
      // Exclude instructors already in a direct conversation
      id: {
        notIn: chattedInstructorIds,
      },
    },
    select: {
      id: true,
      name: true,
      avatar: true,
      // Pull the course title to show context under each instructor
      instructedCourses: {
        where: {
          course: {
            enrollments: {
              some: {
                learnerId: userId,
                enrollmentStatus: "enrolled",
              },
            },
          },
        },
        select: {
          course: {
            select: { id: true, title: true },
          },
        },
        take: 1,
      },
    },
  });
}

export async function getChatMessages(conversationId: string) {
  const { userId } = await getSession();
  if (!userId) return;

  return await prisma.conversation.findUnique({
    where: { id: conversationId, members: { some: { userId } } },
    select: {
      id: true,
      type: true,
      course: { select: { title: true } },
      members: {
        where: { userId: { not: userId } },
        select: { user: { select: { id: true, name: true, avatar: true } } },
      },
      messages: {
        take: 10,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          content: true,
          createdAt: true,
          sender: { select: { id: true, name: true, avatar: true } },
        },
      },
    },
  });
}

export async function sendMessage(conversationId: string, content: string) {
  return await prisma.$transaction(async (tx) => {
    const { userId } = await getSession();
    if (!userId) return;

    const newMessage = await tx.message.create({
      data: {
        conversationId,
        senderId: userId,
        content,
      },
      select: {
        id: true,
        createdAt: true,
        content: true,
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    await tx.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageId: newMessage.id,
        lastMessageAt: newMessage.createdAt,
      },
    });

    const members = await tx.conversationMember.findMany({
      where: { conversationId, userId: { not: userId } },
      select: { userId: true },
    });

    await tx.conversationMember.updateMany({
      where: { conversationId, userId: { not: userId } },
      data: { unreadCount: { increment: 1 } },
    });

    return { newMessage, members };
  });
}
