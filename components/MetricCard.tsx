// components/MetricCard.tsx
type MetricCardProps = {
  label: string
  value: string | number
  sub?:  string
}

export default function MetricCard({ label, value, sub }: MetricCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      {sub && (
        <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">{sub}</p>
      )}
    </div>
  )
}