// components/ChatWindow.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"

type Message = {
  role:    "user" | "assistant"
  content: string
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`
          max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed
          ${isUser
            ? "bg-black text-white rounded-tr-sm"
            : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm"
          }
        `}
      >
        {message.content.split("\n").map((line, i) => (
          <span key={i}>
            {line}
            {i < message.content.split("\n").length - 1 && <br />}
          </span>
        ))}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const SUGGESTED_QUESTIONS = [
  "What are my top 3 best selling products?",
  "Which product category made the most revenue?",
  "Who are my most loyal customers?",
  "What was my best month for sales?",
]

export default function ChatWindow() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [input,    setInput   ] = useState("")
  const [loading,  setLoading ] = useState(false)
  const [error,    setError   ] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  async function sendMessage(question: string) {
    if (!question.trim() || loading) return
    setError("")

    const userMessage: Message = { role: "user", content: question }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput("")
    setLoading(true)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/query`,
        {
          method:  "POST",
          headers: {
            "Content-Type":  "application/json",
            "Authorization": `Bearer ${session?.user?.accessToken}`,
          },
          body: JSON.stringify({
            question,
            conversation_history: updatedMessages
              .slice(-6)
              .map((m) => ({ role: m.role, content: m.content })),
          }),
        }
      )

      if (!res.ok) throw new Error(`API error: ${res.status}`)

      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer }
      ])

    } catch (err) {
      setError("Something went wrong. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto">

      {/* Header */}
      <div id="tour-chat-header" className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          AI Analytics Assistant
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Ask questions about your store data in plain English
        </p>
      </div>

      {/* Chat area */}
      <div className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-y-auto p-4">

        {/* Empty state */}
        {messages.length === 0 && (
          <div id="tour-suggested-questions" className="h-full flex flex-col items-center justify-center gap-4">
            <p className="text-gray-400 dark:text-gray-600 text-sm">
              Try asking one of these questions:
            </p>
            <div className="grid grid-cols-1 gap-2 w-full max-w-lg">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-left px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message list */}
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {/* Typing indicator */}
        {loading && <TypingIndicator />}

        {/* Error message */}
        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm text-center my-2">
            {error}
          </p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <form id="tour-chat-input" onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your store..."
          disabled={loading}
          suppressHydrationWarning
          className="flex-1 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-black dark:bg-white text-white dark:text-black px-5 py-3 rounded-xl text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-40 transition-colors"
        >
          {loading ? "..." : "Send"}
        </button>
      </form>

    </div>
  )
}