// app/(dashboard)/products/page.tsx
import { auth }          from "@/auth"
import { redirect }      from "next/navigation"
import { fetchWithAuth } from "@/lib/api"

export default async function ProductsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const token = session.user.accessToken

  let products = []
  let fetchError = ""

  try {
    products = await fetchWithAuth("/products/", token)
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") redirect("/login")
    fetchError = "Failed to load products. Please refresh."
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

      <div id="tour-products-header">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Products
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {products.length} products in your store
        </p>
      </div>

      <div id="tour-monthly-table" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Product</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Category</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Price</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Stock</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Revenue</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Units Sold</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: any) => (
              <tr
                key={product.id}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                  {product.name}
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    {product.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={`font-medium ${
                    product.stock < 20
                      ? "text-red-500 dark:text-red-400"
                      : "text-gray-700 dark:text-gray-300"
                  }`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
                  ${product.total_revenue.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">
                  {product.total_units_sold}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}