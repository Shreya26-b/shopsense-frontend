type MetricCardProps = {
  label: string
  value: string | number
  sub?:  string
}

export default function MetricCard({ label, value, sub }: MetricCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}