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
  // Admin
  // ------------------------
  const adminHash = await hashPassword("didheenotoutadmin");

  const admin = await prisma.user.create({
    data: {
      organizationId: org.id,
      name: "Admin User",
      email: "admin@demo.com",
      passwordHash: adminHash.hash,
      salt: adminHash.salt,
      role: "admin",
      status: "active",
    },
  });

  // ------------------------
  // Instructors
  // ------------------------
  const instructor1Hash = await hashPassword("didheenotoutinstructor1");

  const instructor1 = await prisma.user.create({
    data: {
      organizationId: org.id,
      name: "Sarah Instructor",
      email: "sarah@demo.com",
      passwordHash: instructor1Hash.hash,
      salt: instructor1Hash.salt,
      role: "instructor",
      status: "active",
    },
  });

  const instructor2Hash = await hashPassword("didheenotoutinstructor2");

  const instructor2 = await prisma.user.create({
    data: {
      organizationId: org.id,
      name: "John Instructor",
      email: "john@demo.com",
      passwordHash: instructor2Hash.hash,
      salt: instructor2Hash.salt,
      role: "instructor",
      status: "active",
    },
  });

  // ------------------------
  // Learners
  // ------------------------
  const learner1Hash = await hashPassword("didheenotoutlearner1");
  const learner2Hash = await hashPassword("didheenotoutlearner2");
  const learner3Hash = await hashPassword("didheenotoutlearner3");

  const learner1 = await prisma.user.create({
    data: {
      organizationId: org.id,
      name: "Alice Learner",
      email: "alice@demo.com",
      passwordHash: learner1Hash.hash,
      salt: learner1Hash.salt,
      role: "learner",
      status: "active",
    },
  });

  const learner2 = await prisma.user.create({
    data: {
      organizationId: org.id,
      name: "Bob Learner",
      email: "bob@demo.com",
      passwordHash: learner2Hash.hash,
      salt: learner2Hash.salt,
      role: "learner",
      status: "active",
    },
  });

  const learner3 = await prisma.user.create({
    data: {
      organizationId: org.id,
      name: "Charlie Learner",
      email: "charlie@demo.com",
      passwordHash: learner3Hash.hash,
      salt: learner3Hash.salt,
      role: "learner",
      status: "active",
    },
  });

  // ------------------------
  // Course
  // ------------------------
  const course = await prisma.course.createManyAndReturn({
    data: [
      {
        organizationId: org.id,
        title: "Full Stack Web Development",
        description: "Learn modern web development with hands-on modules.",
        code: "FSWD-101",
        status: "active",
        coverImageUrl:
          "https://lms-mvp-test.s3.eu-west-1.amazonaws.com/coverImage/1770727138011-didhee.png",
      },
      {
        organizationId: org.id,
        title: "Data Science for Beginners",
        description:
          "An introduction to data analysis, visualization, and machine learning using Python.",
        code: "JSWB-143",
        status: "active",
        coverImageUrl:
          "https://lms-mvp-test.s3.eu-west-1.amazonaws.com/coverImage/1770727138011-didhee.png",
      },
    ],
  });

  // ------------------------
  // Modules
  // ------------------------
  await prisma.module.createMany({
    data: [
      {
        courseId: course[0].id,
        title: "Introduction to Web",
        description: "Basics of the web and how it works",
        position: 1,
        startDate: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        courseId: course[0].id,
        title: "HTML & CSS",
        description: "Build static pages with HTML and CSS",
        position: 2,
        startDate: new Date(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
      {
        courseId: course[0].id,
        title: "JavaScript Basics",
        description: "Programming fundamentals with JavaScript",
        position: 3,
        startDate: new Date(),
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  // ------------------------
  // Assign instructors to course
  // ------------------------
  await prisma.courseInstructor.createMany({
    data: [
      {
        courseId: course[0].id,
        instructorId: instructor1.id,
      },
      {
        courseId: course[0].id,
        instructorId: instructor2.id,
      },
    ],
  });

  // ------------------------
  // Enroll learners
  // ------------------------
  await prisma.enrollment.createMany({
    data: [
      {
        courseId: course[0].id,
        learnerId: learner1.id,
        enrollmentStatus: "enrolled",
        enrolledAt: new Date(),
      },
      {
        courseId: course[1].id,
        learnerId: learner1.id,
        enrollmentStatus: "enrolled",
        enrolledAt: new Date(),
      },
      {
        courseId: course[0].id,
        learnerId: learner2.id,
        enrollmentStatus: "unenrolled",
        inviteSentAt: new Date(),
      },
      {
        courseId: course[0].id,
        learnerId: learner3.id,
        enrollmentStatus: "enrolled",
        enrolledAt: new Date(),
      },
    ],
  });

  // ------------------------
  // Group conversation
  // ------------------------
  const groupConversation = await prisma.conversation.create({
    data: {
      courseId: course[0].id,
      type: "group",
    },
  });

  await prisma.conversationMember.createMany({
    data: [
      { conversationId: groupConversation.id, userId: instructor1.id },
      { conversationId: groupConversation.id, userId: learner1.id },
      { conversationId: groupConversation.id, userId: learner3.id },
    ],
  });

  const modules = await prisma.module.findMany({
    where: {
      courseId: course[0].id,
    },
    orderBy: { position: "asc" },
  });

  await prisma.submission.createMany({
    data: modules.map((m) => ({
      moduleId: m.id,
      learnerId: learner1.id,
      attemptNumber: 1,
      fileUrl:
        "https://lms-mvp-test.s3.eu-west-1.amazonaws.com/submissions/Resume_Didheemose.pdf",
      fileName: "submissions/Resume_Didheemose.pdf",
      fileSize: 80,

      submittedAt: new Date(),
      isLate: false,
      status: "submitted",
    })),
  });

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
