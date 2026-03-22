// components/IndexStatusBanner.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function IndexStatusBanner() {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [building, setBuilding] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!session?.user?.accessToken) return;

    // Only check once per session using sessionStorage
    const checked = sessionStorage.getItem("index_checked");
    if (checked) return;

    checkIndexStatus();
  }, [session]);

  async function checkIndexStatus() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/index/status`,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        },
      );
      if (!res.ok) return; // silently fail — don't bother user

      const data = await res.json();

      // Mark as checked so we don't show again this session
      sessionStorage.setItem("index_checked", "true");

      if (!data.ready) {
        setShowModal(true);
      }
    } catch {
      // Silently fail — don't show error to user
    }
  }

  async function buildIndex() {
    setBuilding(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/index/build`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        },
      );
      if (res.ok) {
        setDone(true);
        setShowModal(false);
        setTimeout(() => setDone(false), 4000);
      }
    } catch {
      // silently fail
    } finally {
      setBuilding(false);
    }
  }

  return (
    <>
      {/* Popup modal — only shows if index not ready */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤖</span>
            </div>

            <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
              Build AI Index First
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
              The chatbot needs to index your store data before answering
              questions. Takes about{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                1-3 minutes
              </span>
              .
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={buildIndex}
                disabled={building}
                className="w-full bg-black dark:bg-white text-white dark:text-black py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                {building ? "Building..." : "Build Index Now"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full text-gray-400 dark:text-gray-600 py-2 text-sm hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success toast — shows briefly after build completes */}
      {done && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white text-sm font-medium px-5 py-3 rounded-full shadow-lg">
          ✅ AI index ready — chatbot is good to go!
        </div>
      )}
    </>
  );
}
