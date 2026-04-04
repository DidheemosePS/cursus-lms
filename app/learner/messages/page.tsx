import { getSession } from "@/lib/auth/auth";
import ChatList from "./chat-list/chat-list";
import ChatWindow from "./chat-window/chat-window";
import {
  getChatList,
  getSuggestedInstructors,
} from "@/dal/learners/message/chat.dal";
import { redirect } from "next/navigation";
import { Suspense } from "react";

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

  // We derive chatted instructor IDs on the client from the chat list,
  // so we pass a separate promise for suggested instructors using an
  // empty exclusion array — the client will filter further if needed.
  // For a cleaner SSR approach we pass both promises independently.
  const getSuggestedInstructorsPromise = getSuggestedInstructors([]);

  return (
    <div className="@container h-[calc(100dvh-4rem)] bg-gray-100 overflow-hidden">
      <div className="h-full overflow-hidden @3xl:grid @3xl:grid-cols-[380px_1fr]">
        <Suspense fallback={<p>Loading</p>}>
          <ChatList
            getChatListPromise={getChatListPromise}
            getSuggestedInstructorsPromise={getSuggestedInstructorsPromise}
            userId={userId}
          />
        </Suspense>
        <ChatWindow chatId={chatId["chat-id"]} />
      </div>
    </div>
  );
}
