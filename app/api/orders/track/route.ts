import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get('orderId');
    const phone = searchParams.get('phone');

    // Validate inputs
    if (!orderId || !phone) {
      return NextResponse.json(
        { error: 'Order ID and phone number are required' },
        { status: 400 }
      );
    }

    // Find order by ID and verify phone number
    const order = await prisma.orderRequest.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    // Check if order exists
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found. Please check your order ID.' },
        { status: 404 }
      );
    }

    // Verify phone number matches (normalize phone numbers for comparison)
    const normalizePhone = (p: string) => p.replace(/[\s\-\(\)]/g, '');
    if (normalizePhone(order.customerPhone) !== normalizePhone(phone)) {
      return NextResponse.json(
        { error: 'Phone number does not match our records.' },
        { status: 404 }
      );
    }

    // Return order details
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerEmail: order.customerEmail,
        customerType: order.customerType,
        deliveryOption: order.deliveryOption,
        deliveryAddress: order.deliveryAddress,
        status: order.status,
        totalAmount: order.totalAmount,
        deliveryFee: order.deliveryFee,
        createdAt: order.createdAt.toISOString(),
        items: order.items.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          product: item.product,
        })),
      },
    });
  } catch (error) {
    console.error('Order tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order details. Please try again.' },
      { status: 500 }
    );
  }
}
