// app/(dashboard)/dashboard/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { fetchWithAuth } from "@/lib/api";
import MetricCard from "@/components/MetricCard";
import RevenueTrendChart from "@/components/RevenueTrendChart";
import TopProductsChart from "@/components/TopProductsChart";
import TopCustomersTable from "@/components/TopCustomersTable";

export default async function DashboardPage() {
  // 1. Get the session — redirect if not logged in
  const session = await auth();
  if (!session) redirect("/login");

  const token = session.user.accessToken;

  // 2. Fetch all four endpoints in parallel
  //    Promise.all means all four requests fire at the same time
  //    instead of waiting for each one to finish before starting the next
  const [overview, trends, products, customers] = await Promise.all([
    fetchWithAuth("/analytics/overview", token),
    fetchWithAuth("/analytics/trends", token),
    fetchWithAuth("/analytics/products", token),
    fetchWithAuth("/analytics/customers", token),
  ]);

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Overview
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Last 6 months — {session.user.email}
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Revenue"
          value={`$${overview.total_revenue.toLocaleString()}`}
          sub="last 6 months"
        />
        <MetricCard
          label="Total Orders"
          value={overview.total_orders}
          sub="last 6 months"
        />
        <MetricCard
          label="Customers"
          value={overview.total_customers}
          sub="unique buyers"
        />
        <MetricCard
          label="Avg Order Value"
          value={`$${overview.avg_order_value}`}
          sub="per transaction"
        />
      </div>

      {/* Revenue trend line chart */}
      <RevenueTrendChart data={trends} />

      {/* Bottom row — products + customers side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProductsChart data={products} />
        <TopCustomersTable data={customers} />
      </div>
    </div>
  );
}
