import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { getSession } from '@/lib/auth';

export default async function AdminDashboard() {
  const session = await getSession();

  const [
    totalProducts,
    publishedProducts,
    pendingApproval,
    lowStockProducts,
    activeAnnouncements,
    totalOrders,
    pendingOrders,
    unreadNotifications,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { workflowState: 'PUBLISHED' } }),
    prisma.product.count({ where: { workflowState: 'PENDING_APPROVAL' } }),
    prisma.product.count({
      where: {
        quantity: { lt: 10 },
        isAvailable: true,
      },
    }),
    prisma.announcement.count({ where: { isActive: true } }),
    prisma.orderRequest.count(),
    prisma.orderRequest.count({ where: { status: 'PENDING' } }),
    prisma.adminNotification.count({ where: { isRead: false } }),
  ]);

  const recentOrders = await prisma.orderRequest.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  const stats = [
    { label: 'Total Products', value: totalProducts, icon: '', color: 'bg-luxury-forest-green/10 text-luxury-forest-green', href: '/admin/products' },
    { label: 'Published', value: publishedProducts, icon: '', color: 'bg-green-50 text-green-600', href: '/admin/products' },
    { label: 'Pending Approval', value: pendingApproval, icon: '', color: 'bg-amber-50 text-amber-600', href: '/admin/approvals' },
    { label: 'Low Stock', value: lowStockProducts, icon: '', color: 'bg-red-50 text-red-600', href: '/admin/inventory' },
    { label: 'Total Orders', value: totalOrders, icon: '', color: 'bg-blue-50 text-blue-600', href: '/admin/orders' },
    { label: 'Pending Orders', value: pendingOrders, icon: '', color: 'bg-purple-50 text-purple-600', href: '/admin/orders' },
    { label: 'Announcements', value: activeAnnouncements, icon: '', color: 'bg-teal-50 text-teal-600', href: '/admin/announcements' },
    { label: 'Unread Alerts', value: unreadNotifications, icon: '', color: 'bg-rose-50 text-rose-600', href: '/admin/notifications' },
  ];

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      PENDING: 'badge-yellow',
      CONFIRMED: 'badge-blue',
      PROCESSING: 'badge-gold',
      DELIVERED: 'badge-green',
      CANCELLED: 'badge-red',
    };
    return badges[status] || 'badge';
  };

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-luxury-charcoal">
          Welcome back, {session.name}
        </h1>
        <p className="text-sm text-gray-500 font-light mt-1">
          Here&apos;s an overview of your farm marketplace
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="card-luxury p-5 group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-sans font-bold ${stat.color}`}>
                {stat.value}
              </span>
            </div>
            <p className="text-xs font-sans font-medium text-gray-500 group-hover:text-luxury-forest-green transition-colors">
              {stat.label}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Add Product', href: '/admin/products/new', icon: '' },
          { label: 'View Orders', href: '/admin/orders', icon: '' },
          { label: 'Inventory', href: '/admin/inventory', icon: '' },
          { label: 'View Store', href: '/', icon: '' },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="card-luxury p-4 text-center group hover:bg-luxury-forest-green/5 transition-colors duration-300"
          >
            <span className="text-2xl block mb-2">{action.icon}</span>
            <span className="text-xs font-sans font-medium text-gray-600 group-hover:text-luxury-forest-green transition-colors">
              {action.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="card-luxury p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-serif font-bold text-luxury-charcoal">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs font-sans text-luxury-forest-green hover:underline tracking-wider uppercase">
            View All →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 font-light">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Type</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-mono text-xs text-gray-500">{order.id.slice(0, 8)}</td>
                    <td className="font-sans font-medium text-luxury-charcoal">{order.customerName}</td>
                    <td>
                      <span className={order.customerType === 'B2B' ? 'badge-gold' : 'badge-green'}>
                        {order.customerType}
                      </span>
                    </td>
                    <td className="text-gray-500">{order.items.length} items</td>
                    <td className="font-serif font-semibold text-luxury-forest-green">${order.totalAmount.toFixed(2)}</td>
                    <td>
                      <span className={getStatusBadge(order.status)}>
                        {order.status}
                      </span>
                    </td>
                    <td className="text-gray-400 text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
