// app/(dashboard)/chat/page.tsx
"use client";

import { useState } from "react";
import ChatWindow from "@/components/ChatWindow";
import IndexStatusBanner from "@/components/IndexStatusBanner";
import ChatHistoryList from "@/components/ChatHistoryList";

export default function ChatPage() {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <IndexStatusBanner />

      {/* Toggle button */}
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-xs text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {showHistory ? "← Back to Chat" : "View History"}
        </button>
      </div>

      {showHistory ? <ChatHistoryList /> : <ChatWindow />}
    </div>
  );
}
