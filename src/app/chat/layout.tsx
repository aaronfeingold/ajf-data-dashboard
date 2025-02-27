"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { MessageCircle, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { withAuth } from "@/hooks/useProtectedRoute";

interface ChatLayoutProps {
  children: React.ReactNode;
}

function ChatLayout({ children }: ChatLayoutProps) {
  const pathname = usePathname();
  const conversations = useAppSelector((state) => state.chat.conversations);
  const [isConversationsOpen, setIsConversationsOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsConversationsOpen(window.innerWidth > 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-full bg-gray-100 dark:bg-gray-900">
      {/* Conversations Sidebar - darker than main chat area */}
      <div
        className={`${
          isConversationsOpen ? "w-64" : "w-0"
        } bg-gray-800 dark:bg-gray-950 flex-shrink-0 transition-all duration-300 md:relative fixed h-full z-10`}
      >
        <div className="flex flex-col h-full">
          {/* New Chat Button */}
          <Link
            href="/chat"
            className="flex items-center gap-2 m-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors duration-200"
          >
            <Plus size={20} />
            <span>New Chat</span>
          </Link>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {conversations.data.map((conv) => (
              <Link
                key={conv.id}
                href={`/chat/${conv.id}`}
                className={`flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 ${
                  pathname === `/chat/${conv.id}`
                    ? "bg-gray-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                <MessageCircle size={16} />
                <span className="truncate">
                  {conv.title || "New conversation"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Toggle Button for Mobile */}
      <button
        onClick={() => setIsConversationsOpen(!isConversationsOpen)}
        className="md:hidden fixed left-4 top-4 z-20 p-2 bg-gray-800 rounded-lg text-white"
      >
        <MessageCircle size={20} />
      </button>

      {/* Main Chat Area - lighter than sidebar */}
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}

export default withAuth(ChatLayout);
