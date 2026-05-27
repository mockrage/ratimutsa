import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Link href="/admin/categories/new" className="btn-primary">
          + Add Category
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold mb-2">{category.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{category.description || 'No description'}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {category._count.products} products
              </span>
              <Link
                href={`/admin/categories/${category.id}/edit`}
                className="text-blue-600 hover:underline text-sm font-semibold"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
