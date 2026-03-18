"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type TrendData = {
  month: string;
  revenue: number;
  orders: number;
};

export default function RevenueTrendChart({ data }: { data: TrendData[] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h2 className="text-sm font-medium text-gray-700 mb-4">Revenue Trend</h2>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} />
          <YAxis
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={(value) => [
              `$${Number(value).toLocaleString()}`,
              "Revenue",
            ]}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#000000"
            strokeWidth={2}
            dot={{ r: 4, fill: "#000000" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
