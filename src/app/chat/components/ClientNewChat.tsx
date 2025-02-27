"use client";

import NewChat from "@/app/chat/components/NewChat";
import { withAuth } from "@/hooks/useProtectedRoute";

function ClientNewChat() {
  return <NewChat />;
}

export default withAuth(ClientNewChat);
