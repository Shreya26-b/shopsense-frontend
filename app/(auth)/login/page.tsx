// app/(auth)/login/page.tsx
"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import ThemeToggleButton from "@/components/ThemeToggleButton"


export default function LoginPage() {
  const router = useRouter()
  const [error,   setError  ] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form     = e.currentTarget
    const email    = (form.elements.namedItem("email")    as HTMLInputElement).value
    const password = (form.elements.namedItem("password") as HTMLInputElement).value

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("Invalid email or password")
      setLoading(false)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <ThemeToggleButton />

      <div className="bg-white dark:bg-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-800 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          Welcome back
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          Sign in to your ShopSense account
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              suppressHydrationWarning
              className="mt-1 w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              suppressHydrationWarning
              className="mt-1 w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>

          {error && (
            <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-black dark:bg-white text-white dark:text-black py-2 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-black dark:text-white font-medium hover:underline"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  )
}