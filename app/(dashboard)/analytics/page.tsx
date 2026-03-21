// app/(dashboard)/analytics/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { fetchWithAuth } from "@/lib/api";

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const token = session.user.accessToken;

  let trends = [];
  let products = [];
  let customers = [];
  let fetchError = "";

  try {
    [trends, products, customers] = await Promise.all([
      fetchWithAuth("/analytics/trends", token),
      fetchWithAuth("/analytics/products", token),
      fetchWithAuth("/analytics/customers", token),
    ]);
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") redirect("/login");
    fetchError = "Failed to load analytics. Please refresh.";
  }

  if (fetchError) {
    return (
      <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <p className="text-sm text-red-600 dark:text-red-400">{fetchError}</p>
      </div>
    );
  }

  // Calculate growth month over month
  const growth =
    trends.length >= 2
      ? (
          ((trends[trends.length - 1].revenue -
            trends[trends.length - 2].revenue) /
            trends[trends.length - 2].revenue) *
          100
        ).toFixed(1)
      : null;

  // Find best and worst month
  const bestMonth = [...trends].sort(
    (a: any, b: any) => b.revenue - a.revenue,
  )[0];
  const worstMonth = [...trends].sort(
    (a: any, b: any) => a.revenue - b.revenue,
  )[0];

  // Calculate total revenue
  const totalRevenue = trends.reduce(
    (sum: number, t: any) => sum + t.revenue,
    0,
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div id="tour-analytics-header">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Analytics
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Deep dive into what's driving your store performance
        </p>
      </div>

      {/* Insight cards — unique to analytics */}
      <div
        id="tour-analytics-insights"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {/* Month over month growth */}
        <div
          id="tour-growth-card"
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Month over month growth
          </p>
          <p
            className={`text-2xl font-bold ${
              growth && parseFloat(growth) >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-500 dark:text-red-400"
            }`}
          >
            {growth ? `${parseFloat(growth) >= 0 ? "+" : ""}${growth}%` : "N/A"}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
            vs previous month
          </p>
        </div>

        {/* Best month */}
        <div
          id="tour-best-month-card"
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Best month
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {bestMonth?.month ?? "N/A"}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
            ${bestMonth?.revenue.toLocaleString()} revenue
          </p>
        </div>

        {/* Worst month */}
        <div
          id="tour-worst-month-card"
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Lowest month
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {worstMonth?.month ?? "N/A"}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
            ${worstMonth?.revenue.toLocaleString()} revenue
          </p>
        </div>
      </div>

      {/* Monthly breakdown table — detailed, not in overview */}
      <div
        id="tour-monthly-table"
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Month by Month Breakdown
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
            Revenue, orders and average order value per month
          </p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                Month
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                Revenue
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                Orders
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                Avg Order
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                % of Total
              </th>
            </tr>
          </thead>
          <tbody>
            {trends.map((row: any, i: number) => (
              <tr
                key={i}
                className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  row.month === bestMonth?.month
                    ? "bg-green-50 dark:bg-green-950"
                    : ""
                }`}
              >
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                  {row.month}
                  {row.month === bestMonth?.month && (
                    <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                      Best
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">
                  ${row.revenue.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">
                  {row.orders}
                </td>
                <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">
                  ${(row.revenue / row.orders).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">
                  {((row.revenue / totalRevenue) * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Revenue by category — unique insight */}
      <div
        id="tour-product-ranking"
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Product Performance Ranking
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
            Every product ranked by revenue with percentage contribution
          </p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                Rank
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                Product
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                Category
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                Revenue
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                Units
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                Share
              </th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const totalProductRevenue = products.reduce(
                (sum: number, p: any) => sum + p.total_revenue,
                0,
              );
              return products.map((product: any, i: number) => (
                <tr
                  key={i}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-4 py-3 text-gray-400 dark:text-gray-600 font-medium">
                    #{i + 1}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                    {product.name}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">
                    ${product.total_revenue.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">
                    {product.total_units}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                        <div
                          className="bg-black dark:bg-white h-1.5 rounded-full"
                          style={{
                            width: `${Math.min(
                              (product.total_revenue / totalProductRevenue) *
                                100,
                              100,
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 w-10 text-right">
                        {(
                          (product.total_revenue / totalProductRevenue) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </td>
                </tr>
              ));
            })()}
          </tbody>
        </table>
      </div>

      {/* Customer spend distribution — unique to analytics */}
      <div
        id="tour-customer-distribution"
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Customer Spend Distribution
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
            Full customer ranking with order frequency and spend share
          </p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                Customer
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                Orders
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                Total Spend
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                Avg per Order
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                Spend Share
              </th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const totalSpend = customers.reduce(
                (sum: number, c: any) => sum + c.total_spend,
                0,
              );
              return customers.map((customer: any, i: number) => (
                <tr
                  key={i}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {customer.name}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-600">
                      {customer.email}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">
                    {customer.total_orders}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
                    ${customer.total_spend.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">
                    ${(customer.total_spend / customer.total_orders).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-400 text-xs">
                    {((customer.total_spend / totalSpend) * 100).toFixed(1)}%
                  </td>
                </tr>
              ));
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );
}
