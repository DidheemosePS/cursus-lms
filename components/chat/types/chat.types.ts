export interface ConversationItem {
  id: string;
  type: "DIRECT" | "GROUP";
  courseId: string;
  lastMessageId: string | null;
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
  course: { title: string };
  members: {
    id: string;
    conversationId: string;
    userId: string;
    unreadCount: number;
    lastReadAt: Date;
    user: {
      id: string;
      name: string;
      avatar: string;
    };
  }[];
  latestMessage: { content: string; createdAt: Date } | null;
}

// Generic suggested item — each wrapper maps its own data to this shape
export interface SuggestedItem {
  id: string; // userId of the person to start a chat with
  name: string;
  avatar: string;
  subtitle: string; // course title (learner) or learner name context (instructor)
  courseId: string; // needed to create the conversation
}

export interface ChatListProps {
  getChatListPromise: Promise<ConversationItem[]>;
  getSuggestedPromise: Promise<SuggestedItem[]>;
  userId: string;
  baseRoute: "/learner/chats" | "/instructor/chats";
  suggestedSectionLabel?: string;
  suggestedSectionHint?: string;
}

export interface ChatMessagesProps {
  id: string;
  createdAt: Date;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
}

export interface ChatMessageItem {
  id: string;
  createdAt: Date;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
}
