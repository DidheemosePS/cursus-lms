import { getSession } from "@/lib/auth/auth";
import ChatWindow from "../../../components/chat/chat-window/chat-window";
import { getChatList, getSuggestedLearners } from "@/dal/chat/chat.dal";
import { redirect } from "next/navigation";
import { Suspense } from "react";
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

  // getChatList works for both roles — it queries by userId regardless of role
  const getChatListPromise = getChatList();

  // Map getSuggestedLearners → SuggestedItem[] so ChatList gets
  // a consistent type regardless of which role is using the component
  const getSuggestedPromise: Promise<SuggestedItem[]> =
    getSuggestedLearners().then((learners) =>
      learners.map((l) => ({
        id: l.id,
        name: l.name,
        avatar: l.avatar,
        subtitle: l.courseTitle,
        courseId: l.courseId,
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
            baseRoute="/instructor/chats"
            suggestedSectionLabel="Your learners"
            suggestedSectionHint="Start a conversation with a learner"
          />
        </Suspense>
        <ChatWindow chatId={chatId["chat-id"]} baseRoute="/instructor/chats" />
      </div>
    </div>
  );
}
