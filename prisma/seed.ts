import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "@/lib/auth/auth";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export async function main() {
  // ------------------------
  // Organization
  // ------------------------
  const org = await prisma.organization.create({
    data: {
      name: "Demo Learning Academy",
      slug: "demo-learning-academy",
    },
  });

  // ------------------------
  // Users
  // ------------------------
  const createUser = async (
    name: string,
    email: string,
    password: string,
    role: "admin" | "instructor" | "learner",
  ) => {
    const hash = await hashPassword(password);
    return prisma.user.create({
      data: {
        organizationId: org.id,
        name,
        email,
        passwordHash: hash.hash,
        salt: hash.salt,
        role,
        status: "active",
      },
    });
  };

  const admin = await createUser(
    "Admin User",
    "admin@demo.com",
    "password",
    "admin",
  );

  const instructor1 = await createUser(
    "Sarah Instructor",
    "sarah@demo.com",
    "password",
    "instructor",
  );

  const instructor2 = await createUser(
    "John Instructor",
    "john@demo.com",
    "password",
    "instructor",
  );

  const learner1 = await createUser(
    "Alice Learner",
    "alice@demo.com",
    "password",
    "learner",
  );

  const learner2 = await createUser(
    "Bob Learner",
    "bob@demo.com",
    "password",
    "learner",
  );

  const learner3 = await createUser(
    "Charlie Learner",
    "charlie@demo.com",
    "password",
    "learner",
  );

  // ------------------------
  // Courses
  // ------------------------
  const course = await prisma.course.create({
    data: {
      organizationId: org.id,
      title: "Full Stack Web Development",
      description: "Learn modern web development with hands-on modules.",
      code: "FSWD-101",
      status: "active",
      coverImageUrl:
        "https://lms-mvp-test.s3.eu-west-1.amazonaws.com/coverImage/1770727138011-didhee.png",
    },
  });

  // ------------------------
  // Modules
  // ------------------------
  await prisma.module.createMany({
    data: [
      {
        courseId: course.id,
        title: "Introduction to Web",
        description: "Basics of the web",
        position: 1,
        startDate: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        courseId: course.id,
        title: "HTML & CSS",
        description: "Build static pages",
        position: 2,
        startDate: new Date(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  // ------------------------
  // Assign Instructors
  // ------------------------
  await prisma.courseInstructor.createMany({
    data: [
      { courseId: course.id, instructorId: instructor1.id },
      { courseId: course.id, instructorId: instructor2.id },
    ],
  });

  // ------------------------
  // Enroll Learners
  // ------------------------
  await prisma.enrollment.createMany({
    data: [
      {
        courseId: course.id,
        learnerId: learner1.id,
        enrollmentStatus: "enrolled",
        enrolledAt: new Date(),
      },
      {
        courseId: course.id,
        learnerId: learner2.id,
        enrollmentStatus: "enrolled",
        enrolledAt: new Date(),
      },
      {
        courseId: course.id,
        learnerId: learner3.id,
        enrollmentStatus: "enrolled",
        enrolledAt: new Date(),
      },
    ],
  });

  // ------------------------
  // Group Conversation
  // ------------------------
  const groupConversation = await prisma.conversation.create({
    data: {
      courseId: course.id,
      type: "GROUP",
    },
  });

  await prisma.conversationMember.createMany({
    data: [
      {
        conversationId: groupConversation.id,
        userId: instructor1.id,
        lastReadAt: new Date(),
      },
      {
        conversationId: groupConversation.id,
        userId: learner1.id,
        lastReadAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
      },
      {
        conversationId: groupConversation.id,
        userId: learner2.id,
        lastReadAt: new Date(),
      },
      {
        conversationId: groupConversation.id,
        userId: learner3.id,
        lastReadAt: new Date(),
      },
    ],
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: groupConversation.id,
        senderId: instructor1.id,
        content: "Welcome everyone to the course!",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
      },
      {
        conversationId: groupConversation.id,
        senderId: learner1.id,
        content: "Excited to start 🚀",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
      },
      {
        conversationId: groupConversation.id,
        senderId: instructor1.id,
        content: "Please review Module 1 this week.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      },
    ],
  });

  // ------------------------
  // Direct Conversation
  // ------------------------
  const directConversation = await prisma.conversation.create({
    data: {
      courseId: course.id,
      type: "DIRECT",
    },
  });

  await prisma.conversationMember.createMany({
    data: [
      {
        conversationId: directConversation.id,
        userId: learner1.id,
        lastReadAt: new Date(),
      },
      {
        conversationId: directConversation.id,
        userId: instructor1.id,
        lastReadAt: new Date(),
      },
    ],
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: directConversation.id,
        senderId: learner1.id,
        content: "Hi, I have a question about Module 2.",
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
      },
      {
        conversationId: directConversation.id,
        senderId: instructor1.id,
        content: "Sure, please ask.",
        createdAt: new Date(Date.now() - 1000 * 60 * 10),
      },
    ],
  });

  const conversations = await prisma.conversation.findMany();

  for (const conv of conversations) {
    const lastMsg = await prisma.message.findFirst({
      where: { conversationId: conv.id },
      orderBy: { createdAt: "desc" },
    });

    if (lastMsg) {
      await prisma.conversation.update({
        where: { id: conv.id },
        data: {
          lastMessageId: lastMsg.id,
          lastMessageAt: lastMsg.createdAt,
        },
      });
    }
  }

  console.log("✅ Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
