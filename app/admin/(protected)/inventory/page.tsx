import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function InventoryPage() {
  const variants = await prisma.productVariant.findMany({
    include: {
      product: { include: { category: true } },
      reservations: {
        where: { expiresAt: { gt: new Date() } },
      },
    },
    orderBy: { inventory: 'asc' },
  });

  const inventoryData = variants.map((variant) => {
    const reserved = variant.reservations.reduce((sum, r) => sum + r.quantity, 0);
    const available = variant.inventory - reserved;
    return {
      ...variant,
      reserved,
      available,
      lowStock: available <= 10,
      outOfStock: available <= 0,
    };
  });

  const lowStockCount = inventoryData.filter(v => v.lowStock).length;
  const outOfStockCount = inventoryData.filter(v => v.outOfStock).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-luxury-charcoal">Inventory Management</h1>
          <p className="text-sm text-gray-500 font-light mt-1">Monitor and manage product inventory levels</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card-luxury p-5">
          <p className="text-xs font-sans tracking-wider uppercase text-gray-500 mb-1">Total Variants</p>
          <p className="text-2xl font-serif font-bold text-luxury-charcoal">{inventoryData.length}</p>
        </div>
        <div className="card-luxury p-5">
          <p className="text-xs font-sans tracking-wider uppercase text-gray-500 mb-1">Low Stock</p>
          <p className="text-2xl font-serif font-bold text-amber-600">{lowStockCount}</p>
        </div>
        <div className="card-luxury p-5">
          <p className="text-xs font-sans tracking-wider uppercase text-gray-500 mb-1">Out of Stock</p>
          <p className="text-2xl font-serif font-bold text-red-600">{outOfStockCount}</p>
        </div>
        <div className="card-luxury p-5">
          <p className="text-xs font-sans tracking-wider uppercase text-gray-500 mb-1">Active Reservations</p>
          <p className="text-2xl font-serif font-bold text-blue-600">
            {inventoryData.reduce((sum, v) => sum + v.reservations.length, 0)}
          </p>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="card-luxury overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Variant</th>
                <th>SKU</th>
                <th>Total Stock</th>
                <th>Reserved</th>
                <th>Available</th>
                <th>Status</th>
                <th>B2C Price</th>
                <th>B2B Price</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div>
                      <p className="font-sans font-medium text-luxury-charcoal">{item.product.name}</p>
                      <p className="text-[10px] text-gray-400">{item.product.category.name}</p>
                    </div>
                  </td>
                  <td className="font-sans text-luxury-charcoal">{item.name}</td>
                  <td className="font-mono text-xs text-gray-500">{item.sku}</td>
                  <td className="font-sans font-semibold">{item.inventory}</td>
                  <td className="font-sans text-blue-600">{item.reserved}</td>
                  <td className="font-sans font-semibold">
                    <span className={item.outOfStock ? 'text-red-600' : item.lowStock ? 'text-amber-600' : 'text-luxury-garden-lime'}>
                      {item.available}
                    </span>
                  </td>
                  <td>
                    {item.outOfStock ? (
                      <span className="badge-red">Out of Stock</span>
                    ) : item.lowStock ? (
                      <span className="badge-yellow">Low Stock</span>
                    ) : (
                      <span className="badge-green">In Stock</span>
                    )}
                  </td>
                  <td className="font-serif font-semibold text-luxury-forest-green">${item.b2cPrice.toFixed(2)}</td>
                  <td className="font-serif text-luxury-windsor-oak">${item.b2bPrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {inventoryData.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 font-light">No product variants found</p>
            <Link href="/admin/products/new" className="btn-primary mt-4 text-xs inline-flex">
              Add Product
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
