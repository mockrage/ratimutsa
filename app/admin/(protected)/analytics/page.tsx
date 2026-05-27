import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AnalyticsClient from './AnalyticsClient';

export default async function AnalyticsPage() {
  const session = await getSession();
  if (session.adminRole !== 'SENIOR_ADMIN') {
    redirect('/admin');
  }

  const [
    totalRevenue,
    totalOrders,
    b2cOrders,
    b2bOrders,
    avgOrderValue,
    topProducts,
    variants,
    allOrders,
  ] = await Promise.all([
    prisma.orderRequest.aggregate({
      _sum: { totalAmount: true },
      where: { status: { not: 'CANCELLED' } },
    }),
    prisma.orderRequest.count({ where: { status: { not: 'CANCELLED' } } }),
    prisma.orderRequest.count({ where: { customerType: 'B2C', status: { not: 'CANCELLED' } } }),
    prisma.orderRequest.count({ where: { customerType: 'B2B', status: { not: 'CANCELLED' } } }),
    prisma.orderRequest.aggregate({
      _avg: { totalAmount: true },
      where: { status: { not: 'CANCELLED' } },
    }),
    prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      _count: true,
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    }),
    prisma.productVariant.findMany({
      include: { product: true, orderItems: true },
    }),
    prisma.orderRequest.findMany({
      where: { status: { not: 'CANCELLED' } },
      select: {
        createdAt: true,
        totalAmount: true,
        status: true,
      },
      orderBy: { createdAt: 'asc' },
    }),
  ]);

  // Get product names for top products
  const productIds = topProducts.map(p => p.productId).filter(Boolean) as string[];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });
  const productMap = new Map(products.map(p => [p.id, p]));

  const revenue = totalRevenue._sum.totalAmount || 0;
  const avgValue = avgOrderValue._avg.totalAmount || 0;

  // Revenue by month
  const revenueByMonth: Record<string, number> = {};
  allOrders.forEach(order => {
    const date = new Date(order.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + order.totalAmount;
  });

  // Orders by status
  const ordersByStatus: Record<string, number> = {};
  allOrders.forEach(order => {
    ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;
  });

  // Inventory turnover
  const inventoryTurnover = variants.map(v => ({
    name: `${v.product.name} - ${v.name}`,
    currentStock: v.inventory,
    totalOrdered: v.orderItems.reduce((sum, i) => sum + i.quantity, 0),
    rate: v.inventory > 0 ? v.orderItems.reduce((sum, i) => sum + i.quantity, 0) / v.inventory : 0,
  })).sort((a, b) => b.rate - a.rate);

  // Prepare data for client
  const analyticsData = {
    revenue,
    totalOrders,
    b2cOrders,
    b2bOrders,
    avgOrderValue: avgValue,
    topProducts: topProducts.map(tp => {
      const product = productMap.get(tp.productId!);
      return {
        id: tp.productId!,
        name: product?.name || 'Unknown',
        orders: tp._count,
        units: tp._sum.quantity || 0,
      };
    }),
    inventoryTurnover,
    revenueByMonth,
    ordersByStatus,
  };

  return <AnalyticsClient data={analyticsData} />;
}
