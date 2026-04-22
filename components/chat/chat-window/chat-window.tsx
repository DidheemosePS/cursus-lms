import { getSession } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { getChatMessages } from "@/dal/chat/chat.dal";
import { WindowHeader } from "./components/window-header";
import ChatMessages from "./components/chat-messages";
import { EmptyWindow } from "./components/empty-window";
import { WindowFooter } from "./components/window-footer";

export const dynamic = "force-dynamic";

export default async function ChatWindow({
  chatId,
  baseRoute,
}: {
  chatId: string | undefined;
  baseRoute: "/learner/chats" | "/instructor/chats";
}) {
  if (!chatId) return <EmptyWindow />;

  const { userId } = await getSession();
  if (!userId) redirect("/login");

  const rawMessages = await getChatMessages(chatId);

  const isGroup = rawMessages?.type === "GROUP";

  return (
    <section className="flex flex-col h-full bg-gray-50 overflow-scroll">
      <WindowHeader
        isGroup={isGroup}
        baseRoute={baseRoute}
        courseTitle={rawMessages?.course.title ?? ""}
        members={rawMessages?.members ?? []}
      />

      {rawMessages?.messages && userId && (
        <ChatMessages
          key={chatId}
          initialChatMessages={rawMessages.messages}
          userId={userId}
        />
      )}

      <WindowFooter chatId={chatId} />
    </section>
  );
}
