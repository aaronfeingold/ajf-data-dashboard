interface Conversation {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  user: number;
  messages?: ConversationMessage[];
}

interface ConversationMessage {
  id: number;
  sequence: number;
  role: "user" | "assistant";
  status: string | null;
  taskId: string | null;
  message: string;
  created: string;
  updated: string;
  conversation: number;
}

export type { Conversation, ConversationMessage };
