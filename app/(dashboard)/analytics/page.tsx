// app/(dashboard)/analytics/page.tsx
import { auth }          from "@/auth"
import { redirect }      from "next/navigation"
import { fetchWithAuth } from "@/lib/api"
import RevenueTrendChart from "@/components/RevenueTrendChart"
import TopProductsChart  from "@/components/TopProductsChart"

export default async function AnalyticsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const token = session.user.accessToken

  let trends    = []
  let products  = []
  let customers = []
  let fetchError = ""

  try {
    ;[trends, products, customers] = await Promise.all([
      fetchWithAuth("/analytics/trends",    token),
      fetchWithAuth("/analytics/products",  token),
      fetchWithAuth("/analytics/customers", token),
    ])
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") redirect("/login")
    fetchError = "Failed to load analytics. Please refresh."
  }

  if (fetchError) {
    return (
      <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <p className="text-sm text-red-600 dark:text-red-400">{fetchError}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Analytics
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Detailed breakdown of your store performance
        </p>
      </div>

      <RevenueTrendChart data={trends} />

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Monthly Revenue Breakdown
          </h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Month</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Revenue</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Orders</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Avg Order</th>
            </tr>
          </thead>
          <tbody>
            {trends.map((row: any, i: number) => (
              <tr
                key={i}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{row.month}</td>
                <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">${row.revenue.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">{row.orders}</td>
                <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">${(row.revenue / row.orders).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TopProductsChart data={products} />

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Top Customers by Spend
          </h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Customer</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Orders</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Total Spend</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer: any, i: number) => (
              <tr
                key={i}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900 dark:text-white">{customer.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-600">{customer.email}</p>
                </td>
                <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">{customer.total_orders}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">${customer.total_spend.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}