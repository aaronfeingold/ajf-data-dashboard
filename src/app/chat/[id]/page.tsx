"use client";

import ChatPage from "@/app/chat/[id]/ChatPage";
import { withAuth } from "@/hooks/useProtectedRoute";

function ClientChatPage() {
  return <ChatPage />;
}

export default withAuth(ClientChatPage);
