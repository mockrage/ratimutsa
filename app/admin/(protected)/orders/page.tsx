import { prisma } from '@/lib/prisma';
import OrdersClient from './OrdersClient';

export default async function AdminOrdersPage() {
  const orders = await prisma.orderRequest.findMany({
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Serialize dates for client component
  const serializedOrders = orders.map(order => ({
    ...order,
    createdAt: order.createdAt.toISOString(),
    deliveryDate: order.deliveryDate?.toISOString() || null,
  }));

  return <OrdersClient orders={serializedOrders} />;
}
