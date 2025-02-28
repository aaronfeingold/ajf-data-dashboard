"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { sendMessage, setActiveConversation } from "@/store/chatSlice";
import { Send } from "lucide-react";
import ChatLoading from "@/components/Loading/ChatLoading";

// Message bubble component
const MessageBubble = ({
  role,
  message,
}: {
  role: string;
  message: string;
}) => (
  <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
    <div
      className={`max-w-[80%] p-4 rounded-lg ${
        role === "user" ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-100"
      }`}
    >
      {message}
    </div>
  </div>
);

// Loading indicator for when a message is being sent
const MessageLoadingIndicator = () => (
  <div className="flex justify-start">
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        />
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.4s" }}
        />
      </div>
    </div>
  </div>
);

// Chat messages container with loading state
const ChatMessages = ({
  conversationId,
  status,
}: {
  conversationId: string;
  status: string;
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversation = useAppSelector((state) =>
    state.chat.conversations.data.find((c) => c.id === parseInt(conversationId))
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages]);

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">Conversation not found</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="max-w-3xl mx-auto p-4 space-y-4">
        {conversation.messages?.map((msg, idx) => (
          <MessageBubble key={idx} role={msg.role} message={msg.message} />
        ))}
        {status === "loading" && <MessageLoadingIndicator />}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default function ChatPage() {
  const { id } = useParams() as { id: string };
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState("");

  const { status } = useAppSelector((state) => state.chat);

  useEffect(() => {
    if (id) {
      dispatch(setActiveConversation(id));
    }
  }, [id, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || status === "loading" || !id) return;

    const currentMessage = message;
    setMessage("");
    await dispatch(
      sendMessage({ conversation: parseInt(id), message: currentMessage })
    );
  };

  return (
    <div className="flex flex-col h-full relative">
      <Suspense fallback={<ChatLoading />}>
        <ChatMessages conversationId={id} status={status} />
      </Suspense>

      {/* Footer - absolutely positioned */}
      <div className="absolute bottom-0 left-0 right-0 h-24 border-t border-gray-800 bg-gray-900">
        <div className="max-w-3xl mx-auto h-full p-4">
          <form onSubmit={handleSubmit} className="flex gap-4 h-full">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message..."
              className="flex-1 p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!message.trim() || status === "loading"}
              className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
