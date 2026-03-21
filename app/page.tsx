// app/page.tsx
"use client";

import ThemeToggleButton from "@/components/ThemeToggleButton"


export default function HomePage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
      <ThemeToggleButton />
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          ShopSense
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          AI-Powered E-commerce Analytics
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/login"
            className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 text-sm font-medium transition-colors"
          >
            Sign In
          </a>
          <a
            href="/register"
            className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-medium transition-colors"
          >
            Create Account
          </a>
        </div>
      </div>
    </main>
  );
}
