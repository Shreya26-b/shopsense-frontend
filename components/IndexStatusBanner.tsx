// components/IndexStatusBanner.tsx
"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

type Status = "checking" | "ready" | "not_ready" | "error"

const BUILDING_MESSAGES = [
  "Loading AI model...",
  "Preparing your store data...",
  "Creating embeddings...",
  "Building search index...",
  "Almost done...",
]

export default function IndexStatusBanner() {
  const { data: session }             = useSession()
  const [status,     setStatus      ] = useState<Status>("checking")
  const [building,   setBuilding    ] = useState(false)
  const [dismissed,  setDismissed   ] = useState(false)
  const [showModal,  setShowModal   ] = useState(false)
  const [buildMsg,   setBuildMsg    ] = useState(BUILDING_MESSAGES[0])
  const [buildDone,  setBuildDone   ] = useState(false)

  useEffect(() => {
    if (!session?.user?.accessToken) return
    checkIndexStatus()
  }, [session])

  // Cycle through messages while building
  useEffect(() => {
    if (!building) return
    let i = 0
    const interval = setInterval(() => {
      i = Math.min(i + 1, BUILDING_MESSAGES.length - 1)
      setBuildMsg(BUILDING_MESSAGES[i])
    }, 15000)
    return () => clearInterval(interval)
  }, [building])

  async function checkIndexStatus() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/index/status`,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        }
      )
      if (!res.ok) {
        setStatus("error")
        return
      }
      const data = await res.json()
      if (data.ready) {
        setStatus("ready")
      } else {
        setStatus("not_ready")
        setShowModal(true)  // ← auto show modal if not ready
      }
    } catch {
      setStatus("error")
    }
  }

  async function buildIndex() {
    setBuilding(true)
    setBuildMsg(BUILDING_MESSAGES[0])
    setShowModal(false)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/index/build`,
        {
          method:  "POST",
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        }
      )
      if (res.ok) {
        setStatus("ready")
        setBuildDone(true)
        setTimeout(() => setBuildDone(false), 4000)
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    } finally {
      setBuilding(false)
    }
  }

  // ── Modal — shown automatically when index not ready ──────
  const Modal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl">

        {/* Icon */}
        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🤖</span>
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
          Build AI Index First
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-1">
          Before using the chatbot the AI needs to index your store data.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
          This takes about <span className="font-medium text-gray-700 dark:text-gray-300">1-3 minutes</span> and only needs to be done once per session.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={buildIndex}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Build Index Now
          </button>
          <button
            onClick={() => { setShowModal(false); setDismissed(true) }}
            className="w-full text-gray-400 dark:text-gray-600 py-2 text-sm hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
          >
            Skip for now
          </button>
        </div>

      </div>
    </div>
  )

  // ── Building progress banner ───────────────────────────────
  const BuildingBanner = () => (
    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-center gap-3 mb-4">
      <div className="flex-shrink-0 w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
      <div className="flex-1">
        <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
          Building AI index...
        </p>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
          {buildMsg} Please keep this page open.
        </p>
      </div>
      <span className="text-xs text-blue-400 dark:text-blue-600 flex-shrink-0">
        1-3 mins
      </span>
    </div>
  )

  // ── Success banner ─────────────────────────────────────────
  const SuccessBanner = () => (
    <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center gap-3 mb-4">
      <span className="text-green-500 text-lg flex-shrink-0">✅</span>
      <p className="text-sm font-medium text-green-800 dark:text-green-300">
        AI index ready — you can now use the chatbot!
      </p>
    </div>
  )

  // ── Not ready banner (after modal dismissed) ───────────────
  const NotReadyBanner = () => (
    <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
      <div className="flex items-start gap-3 flex-1">
        <span className="text-amber-500 text-lg flex-shrink-0">⚠️</span>
        <div>
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
            AI index not built yet
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
            Build the index to enable the chatbot.
          </p>
        </div>
      </div>
      <button
        onClick={() => setShowModal(true)}
        className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors flex-shrink-0"
      >
        Build Index
      </button>
    </div>
  )

  // ── Error banner ───────────────────────────────────────────
  const ErrorBanner = () => (
    <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3 mb-4">
      <span className="text-red-500 text-lg flex-shrink-0">❌</span>
      <div className="flex-1">
        <p className="text-sm font-medium text-red-800 dark:text-red-300">
          Could not check AI index status
        </p>
        <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">
          Backend may be waking up. Wait 30 seconds and refresh.
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-red-400 hover:text-red-600 text-xs px-2 flex-shrink-0"
      >
        Dismiss
      </button>
    </div>
  )

  return (
    <>
      {/* Modal — auto shows when index not ready */}
      {showModal && <Modal />}

      {/* Inline banners */}
      {!dismissed && (
        <>
          {building                                    && <BuildingBanner />}
          {buildDone                                   && <SuccessBanner  />}
          {status === "not_ready" && !building && !showModal && <NotReadyBanner />}
          {status === "error"     && !building         && <ErrorBanner    />}
        </>
      )}
    </>
  )
}