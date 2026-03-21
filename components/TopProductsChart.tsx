"use client"

import { useTheme } from "next-themes"
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"

type ProductData = {
  name:          string
  total_revenue: number
  total_units:   number
}

export default function TopProductsChart({ data }: { data: ProductData[] }) {
  const { theme } = useTheme()
  const isDark    = theme === "dark"

  const colors = {
    grid:   isDark ? "#1f2937" : "#f0f0f0",
    axis:   isDark ? "#6b7280" : "#9ca3af",
    bar:    isDark ? "#ffffff" : "#000000",
    bg:     isDark ? "#111827" : "#ffffff",
    border: isDark ? "#1f2937" : "#e5e7eb",
    text:   isDark ? "#f9fafb" : "#111827",
  }

  const chartData = data.map((p) => ({
    ...p,
    shortName: p.name.length > 15 ? p.name.slice(0, 15) + "…" : p.name,
  }))

  return (
    <div
      style={{ background: colors.bg, borderColor: colors.border }}
      className="border rounded-xl p-5"
    >
      <h2
        style={{ color: colors.text }}
        className="text-sm font-medium mb-4"
      >
        Top Products by Revenue
      </h2>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis
            type="number"
            tick={{ fontSize: 12, fill: colors.axis }}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <YAxis
            type="category"
            dataKey="shortName"
            width={120}
            tick={{ fontSize: 12, fill: colors.axis }}
          />
          <Tooltip
            contentStyle={{
              background:   colors.bg,
              border:       `1px solid ${colors.border}`,
              borderRadius: "8px",
              color:        colors.text,
            }}
            formatter={(value) =>
              [`$${Number(value).toLocaleString()}`, "Revenue"]
            }
          />
          <Bar dataKey="total_revenue" fill={colors.bar} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}