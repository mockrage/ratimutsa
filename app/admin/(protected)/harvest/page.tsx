import { prisma } from '@/lib/prisma';
import Link from 'next/link';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default async function AdminHarvestPage() {
  const harvestItems = await prisma.harvestCalendar.findMany({
    orderBy: { startMonth: 'asc' },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Harvest Calendar</h1>
        <Link href="/admin/harvest/new" className="btn-primary">
          + Add Harvest Period
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6">Product</th>
              <th className="text-left py-4 px-6">Start Month</th>
              <th className="text-left py-4 px-6">End Month</th>
              <th className="text-left py-4 px-6">Year</th>
              <th className="text-left py-4 px-6">Description</th>
              <th className="text-left py-4 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {harvestItems.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-6 font-semibold">{item.productName}</td>
                <td className="py-4 px-6">{monthNames[item.startMonth - 1]}</td>
                <td className="py-4 px-6">{monthNames[item.endMonth - 1]}</td>
                <td className="py-4 px-6">{item.year || 'All years'}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{item.description || '-'}</td>
                <td className="py-4 px-6">
                  <Link
                    href={`/admin/harvest/${item.id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
