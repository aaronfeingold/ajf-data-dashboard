"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createConversation, sendMessage } from "@/store/chatSlice";
import { MessageSquare } from "lucide-react";

const quickActions = [
  "Tell me all the Indianapolis property owners who own other properties outside of the city.",
  "Give me a sales pitch for prospective client",
  "Compare my reports and tell me which one would net me the most profit",
];

export default function NewChat() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [initialMessage, setInitialMessage] = useState("");
  const recentConversations = useAppSelector((state) =>
    [...state.chat.conversations.data]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 4)
  );

  const handleNewChat = async () => {
    if (!initialMessage.trim()) return;
    try {
      const conversation = await dispatch(
        createConversation({ title: "ooooo yeah baby", user: 2 })
      ).unwrap();
      // Send the initial message
      // Then send the message and wait for it to complete
      await dispatch(
        sendMessage({
          conversation: conversation.id,
          message: initialMessage.trim(),
        })
      ).unwrap();
      router.push(`/chat/${conversation.id}`);
    } catch (error) {
      console.error("Failed to create new chat:", error);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    handleNewChat();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6 space-y-8">
          {/* Input section at the top */}
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="relative">
              <input
                type="text"
                value={initialMessage}
                onChange={(e) => setInitialMessage(e.target.value)}
                placeholder="How can I help you today?"
                className="w-full p-4 pr-12 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-white"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Quick actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <button
                key={action}
                onClick={() => {
                  setInitialMessage(action);
                  handleNewChat();
                }}
                className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-left"
              >
                {action}
              </button>
            ))}
          </div>

          {/* Recent conversations */}
          {recentConversations.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-200">
                Recent chats
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => router.push(`/chat/${conv.id}`)}
                    className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-left"
                  >
                    <span className="text-sm text-gray-300">
                      {conv.title || "New conversation"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
