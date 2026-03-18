// components/TopProductsChart.tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ProductData = {
  name: string;
  total_revenue: number;
  total_units: number;
};

export default function TopProductsChart({ data }: { data: ProductData[] }) {
  // Shorten long product names for the chart
  const chartData = data.map((p) => ({
    ...p,
    shortName: p.name.length > 15 ? p.name.slice(0, 15) + "…" : p.name,
  }));

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h2 className="text-sm font-medium text-gray-700 mb-4">
        Top Products by Revenue
      </h2>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            type="number"
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <YAxis
            type="category"
            dataKey="shortName"
            width={120}
            tick={{ fontSize: 12, fill: "#6b7280" }}
          />
          <Tooltip
            formatter={(value) => [
              `$${Number(value).toLocaleString()}`,
              "Revenue",
            ]}
          />
          <Bar dataKey="total_revenue" fill="#000000" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
