// app/page.tsx
"use client";

import ThemeToggleButton from "@/components/ThemeToggleButton";

const FEATURES = [
  {
    icon: "📊",
    title: "Live Dashboard",
    desc: "Revenue trends, top products and customer insights at a glance",
  },
  {
    icon: "🤖",
    title: "AI Chat Assistant",
    desc: "Ask questions about your store in plain English — get instant answers",
  },
  {
    icon: "📦",
    title: "Product Analytics",
    desc: "Track stock levels, units sold and revenue per product",
  },
  {
    icon: "📁",
    title: "CSV Import",
    desc: "Upload your store data from any platform in seconds",
  },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-gray-50 dark:bg-gray-950">
      <ThemeToggleButton />

      {/* Hero section */}
      <div className="flex flex-col items-center justify-center pt-20 pb-12 px-4 text-center">
        {/* Badge */}
        <span className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-medium bg-black dark:bg-white text-white dark:text-black">
          AI-Powered Analytics
        </span>

        {/* Headline */}
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
          ShopSense
        </h1>

        {/* Subheadline */}
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-3 max-w-lg">
          Understand your e-commerce store through data — without needing a data
          analyst.
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-600 mb-8 max-w-md">
          Import your products and orders, then ask the AI anything about your
          store performance in plain English.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
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

        {/* Demo credentials */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-6 py-4 max-w-sm w-full text-left">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
            Try with demo account — no signup needed
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400 dark:text-gray-600">
                Email
              </span>
              <code className="text-xs font-mono bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                test@shopsense.com
              </code>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400 dark:text-gray-600">
                Password
              </span>
              <code className="text-xs font-mono bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                password123
              </code>
            </div>
          </div>
          <a
            href="/login"
            className="mt-3 block w-full text-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium py-2 rounded-lg transition-colors"
          >
            Use demo account →
          </a>
        </div>
      </div>

      {/* Features section */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <p className="text-center text-xs font-medium text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-8">
          Everything you need to understand your store
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5"
            >
              <span className="text-2xl mb-3 block">{f.icon}</span>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                {f.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
