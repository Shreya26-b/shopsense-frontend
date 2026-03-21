// components/SignOutButton.tsx
"use client"
import { signOut } from "next-auth/react"

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="w-full px-3 py-2 rounded-lg text-sm text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
    >
      Sign out
    </button>
  )
}