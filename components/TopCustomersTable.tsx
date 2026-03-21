// components/TopCustomersTable.tsx

type CustomerData = {
  name: string;
  email: string;
  total_orders: number;
  total_spend: number;
};

export default function TopCustomersTable({ data }: { data: CustomerData[] }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
      <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
        Top Customers
      </h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-400 dark:text-gray-600 border-b border-gray-100 dark:border-gray-800">
            <th className="pb-2 font-medium">Customer</th>
            <th className="pb-2 font-medium text-right">Orders</th>
            <th className="pb-2 font-medium text-right">Spend</th>
          </tr>
        </thead>
        <tbody>
          {data.map((customer, i) => (
            <tr
              key={i}
              className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="py-2">
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {customer.name}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-600">
                  {customer.email}
                </p>
              </td>
              <td className="py-2 text-right text-gray-600 dark:text-gray-400">
                {customer.total_orders}
              </td>
              <td className="py-2 text-right font-medium text-gray-800 dark:text-gray-200">
                ${customer.total_spend.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
