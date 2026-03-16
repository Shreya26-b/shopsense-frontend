export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <aside className="w-64 border-r bg-gray-50 p-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold mb-4">ShopSense</h2>
        <nav className="flex flex-col gap-2">
          <a href="/dashboard"  className="px-3 py-2 rounded hover:bg-gray-200 text-sm">Overview</a>
          <a href="/products"   className="px-3 py-2 rounded hover:bg-gray-200 text-sm">Products</a>
          <a href="/analytics"  className="px-3 py-2 rounded hover:bg-gray-200 text-sm">Analytics</a>
          <a href="/chat"       className="px-3 py-2 rounded hover:bg-gray-200 text-sm">AI Chat</a>
          <a href="/import"     className="px-3 py-2 rounded hover:bg-gray-200 text-sm">Import CSV</a>
        </nav>
      </aside>

      {/* Main content area — pages render here */}
      <main className="flex-1 p-8">
        {children}
      </main>

    </div>
  )
}