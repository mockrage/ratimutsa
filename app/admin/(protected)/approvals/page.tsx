import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import ApprovalActions from './ApprovalActions';

export default async function ApprovalsPage() {
  const session = await getSession();
  if (session.adminRole !== 'SENIOR_ADMIN') {
    redirect('/admin');
  }

  const pendingProducts = await prisma.product.findMany({
    where: { workflowState: 'PENDING_APPROVAL' },
    include: { category: true, variants: true },
    orderBy: { updatedAt: 'desc' },
  });

  const recentlyProcessed = await prisma.product.findMany({
    where: { workflowState: { in: ['PUBLISHED', 'REJECTED'] } },
    include: { category: true },
    orderBy: { updatedAt: 'desc' },
    take: 10,
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-luxury-charcoal">Approval Queue</h1>
        <p className="text-sm text-gray-500 font-light mt-1">
          Review and approve product submissions
        </p>
      </div>

      {/* Pending Count */}
      <div className="card-luxury p-5 mb-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center">
          <span className="text-xl">⏳</span>
        </div>
        <div>
          <p className="text-2xl font-serif font-bold text-luxury-charcoal">{pendingProducts.length}</p>
          <p className="text-xs text-gray-500 font-sans">Products awaiting approval</p>
        </div>
      </div>

      {/* Pending Products */}
      {pendingProducts.length === 0 ? (
        <div className="card-luxury p-12 text-center">
          <div className="text-4xl mb-4 opacity-30">✅</div>
          <h3 className="text-lg font-serif font-bold text-luxury-charcoal mb-2">All Caught Up!</h3>
          <p className="text-gray-500 font-light text-sm">No products pending approval</p>
        </div>
      ) : (
        <div className="space-y-4 mb-12">
          {pendingProducts.map((product) => (
            <div key={product.id} className="card-luxury p-6">
              <div className="flex gap-6">
                <div className="relative w-24 h-24 rounded-sm overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="badge-gold text-[10px] mb-2 inline-block">{product.category.name}</span>
                      <h3 className="text-lg font-serif font-bold text-luxury-charcoal">{product.name}</h3>
                      <p className="text-sm text-gray-500 font-light mt-1 line-clamp-2">{product.description}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-sm font-serif font-semibold text-luxury-forest-green">
                          ${product.price.toFixed(2)}/{product.unit}
                        </span>
                        <span className="text-xs text-gray-400">
                          {product.quantity} in stock
                        </span>
                        <span className="text-xs text-gray-400">
                          {product.variants.length} variants
                        </span>
                      </div>
                    </div>
                    <ApprovalActions productId={product.id} productName={product.name} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recently Processed */}
      <div className="mt-12">
        <h2 className="text-lg font-serif font-bold text-luxury-charcoal mb-4">Recently Processed</h2>
        <div className="card-luxury overflow-hidden">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {recentlyProcessed.map((product) => (
                <tr key={product.id}>
                  <td className="font-sans font-medium">{product.name}</td>
                  <td className="text-gray-500">{product.category.name}</td>
                  <td>
                    <span className={product.workflowState === 'PUBLISHED' ? 'badge-green' : 'badge-red'}>
                      {product.workflowState}
                    </span>
                  </td>
                  <td className="text-xs text-gray-400">
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
