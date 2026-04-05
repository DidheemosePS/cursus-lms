import { getSession } from "@/lib/auth/auth";
import { getChatList, getSuggestedInstructors } from "@/dal/chat/chat.dal";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ChatWindow from "@/components/chat/chat-window/chat-window";
import { SuggestedItem } from "@/components/chat/types/chat.types";
import ChatList from "@/components/chat/chat-list/chat-list";

export interface ActiveChat {
  id: number;
  avatar: string;
  name: string;
  course: string;
  isGroup: boolean;
}

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const chatId = await searchParams;
  const { userId } = await getSession();
  if (!userId) redirect("/login");

  const getChatListPromise = getChatList();

  // Map getSuggestedInstructors → SuggestedItem[] so ChatList gets
  // a consistent type regardless of which role is using the component
  const getSuggestedPromise: Promise<SuggestedItem[]> = getSuggestedInstructors(
    [],
  ).then((instructors) =>
    instructors.map((i) => ({
      id: i.id,
      name: i.name,
      avatar: i.avatar,
      subtitle: i.instructedCourses[0]?.course.title ?? "",
      courseId: i.instructedCourses[0]?.course.id ?? "",
    })),
  );

  return (
    <div className="@container h-[calc(100dvh-4rem)] bg-gray-100 overflow-hidden">
      <div className="h-full overflow-hidden @3xl:grid @3xl:grid-cols-[380px_1fr]">
        <Suspense fallback={<p>Loading</p>}>
          <ChatList
            getChatListPromise={getChatListPromise}
            getSuggestedPromise={getSuggestedPromise}
            userId={userId}
            baseRoute="/learner/chats"
            suggestedSectionLabel="Your Instructors"
            suggestedSectionHint="Start a conversation with a instructor"
          />
        </Suspense>
        <ChatWindow chatId={chatId["chat-id"]} baseRoute={"/learner/chats"} />
      </div>
    </div>
  );
}
