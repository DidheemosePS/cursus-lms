"use client";

import { useState } from "react";
import ChatList from "./chat-list";
import ChatWindow from "./chat-window";

export interface ActiveChat {
  id: number;
  avatar: string;
  name: string;
  course: string;
  isGroup: boolean;
}

export default function ChatShell() {
  const [activeChat, setActiveChat] = useState<ActiveChat | null>(null);

  return (
    <div className="@container h-[calc(100dvh-4rem)] bg-gray-100 overflow-hidden">
      {/* Desktop layout */}
      <div className="hidden h-full overflow-hidden @3xl:grid @3xl:grid-cols-[380px_1fr]">
        <ChatList activeChat={activeChat} onSelect={setActiveChat} />
        <ChatWindow chat={activeChat} />
      </div>

      {/* Mobile layout */}
      <div className="@3xl:hidden h-full">
        {activeChat === null ? (
          <ChatList activeChat={activeChat} onSelect={setActiveChat} />
        ) : (
          <ChatWindow chat={activeChat} onBack={() => setActiveChat(null)} />
        )}
      </div>
    </div>
  );
}
