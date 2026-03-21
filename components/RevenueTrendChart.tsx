// components/RevenueTrendChart.tsx
"use client";

import { useTheme } from "next-themes";
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
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const colors = {
    grid: isDark ? "#1f2937" : "#f0f0f0",
    axis: isDark ? "#6b7280" : "#9ca3af",
    line: isDark ? "#ffffff" : "#000000",
    dot: isDark ? "#ffffff" : "#000000",
    bg: isDark ? "#111827" : "#ffffff",
    border: isDark ? "#1f2937" : "#e5e7eb",
    text: isDark ? "#f9fafb" : "#111827",
  };

  return (
    <div
      style={{ background: colors.bg, borderColor: colors.border }}
      className="border rounded-xl p-5"
    >
      <h2 style={{ color: colors.text }} className="text-sm font-medium mb-4">
        Revenue Trend
      </h2>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: colors.axis }} />
          <YAxis
            tick={{ fontSize: 12, fill: colors.axis }}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              background: colors.bg,
              border: `1px solid ${colors.border}`,
              borderRadius: "8px",
              color: colors.text,
            }}
            formatter={(value) => [
              `$${Number(value).toLocaleString()}`,
              "Revenue",
            ]}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke={colors.line}
            strokeWidth={2}
            dot={{ r: 4, fill: colors.dot }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
