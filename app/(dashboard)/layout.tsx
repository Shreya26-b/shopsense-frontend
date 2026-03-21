// app/(dashboard)/layout.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import SignOutButton from "@/components/SignOutButton";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/products", label: "Products" },
  { href: "/analytics", label: "Analytics" },
  { href: "/chat", label: "AI Chat" },
  { href: "/import", label: "Import CSV" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-30
          bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-800
          p-6 flex flex-col gap-2
          transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            ShopSense
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        {/* Navigation */}
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`
        px-3 py-2 rounded-lg text-sm transition-colors
        ${
          pathname === item.href
            ? "bg-black text-white dark:bg-white dark:text-black font-medium"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        }
      `}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-4 flex flex-col gap-1">
          <ThemeToggle />
          <p className="text-xs text-gray-400 dark:text-gray-600 px-3 truncate">
            {session?.user?.email}
          </p>
          <SignOutButton />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setOpen(true)}
            className="text-gray-600 dark:text-gray-400 text-xl"
          >
            ☰
          </button>
          <h1 className="font-bold text-gray-900 dark:text-white">ShopSense</h1>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
