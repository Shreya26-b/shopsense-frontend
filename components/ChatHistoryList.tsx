// components/ChatHistoryList.tsx
"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

type HistoryItem = {
  question:   string
  answer:     string
  created_at: string
}

export default function ChatHistoryList() {
  const { data: session }        = useSession()
  const [history,  setHistory  ] = useState<HistoryItem[]>([])
  const [loading,  setLoading  ] = useState(true)
  const [expanded, setExpanded ] = useState<number | null>(null)

  useEffect(() => {
    async function fetchHistory() {
      if (!session?.user?.accessToken) return

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/history`,
          {
            headers: {
              Authorization: `Bearer ${session.user.accessToken}`,
            },
          }
        )
        const data = await res.json()
        setHistory(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [session])

  if (loading) {
    return (
      <p className="text-sm text-gray-400 dark:text-gray-500">
        Loading history...
      </p>
    )
  }

  if (history.length === 0) {
    return (
      <p className="text-sm text-gray-400 dark:text-gray-500">
        No chat history yet — ask your first question!
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {history.map((item, i) => (
        <div
          key={i}
          className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
        >
          {/* Question header — click to expand */}
          <button
            onClick={() => setExpanded(expanded === i ? null : i)}
            className="w-full text-left px-4 py-3 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate pr-4">
              {item.question}
            </span>
            <span className="text-gray-400 dark:text-gray-600 text-xs flex-shrink-0">
              {expanded === i ? "▲" : "▼"}
            </span>
          </button>

          {/* Answer — shown when expanded */}
          {expanded === i && (
            <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-relaxed whitespace-pre-wrap">
                {item.answer}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-600 mt-2">
                {new Date(item.created_at).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}