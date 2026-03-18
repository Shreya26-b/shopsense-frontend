// app/(dashboard)/layout.tsx
import { auth }    from "@/auth"
import { redirect } from "next/navigation"
import SignOutButton from "@/components/SignOutButton"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <aside className="w-64 border-r bg-white p-6 flex flex-col gap-2">
        <h2 className="text-xl font-bold mb-6">ShopSense</h2>

        <nav className="flex flex-col gap-1 flex-1">
          <a href="/dashboard"
            className="px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-700">
            Overview
          </a>
          <a href="/products"
            className="px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-700">
            Products
          </a>
          <a href="/analytics"
            className="px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-700">
            Analytics
          </a>
          <a href="/chat"
            className="px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-700">
            AI Chat
          </a>
          <a href="/import"
            className="px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-700">
            Import CSV
          </a>
        </nav>

        {/* User info + sign out */}
        <div className="border-t pt-4">
          <p className="text-xs text-gray-400 mb-3 truncate">
            {session.user.email}
          </p>
          <SignOutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>

    </div>
  )
}