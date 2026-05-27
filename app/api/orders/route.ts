import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { applyRateLimit, RateLimitPresets } from '@/lib/rate-limit';

const orderSchema = z.object({
  customerName: z.string().min(1),
  customerPhone: z.string().min(1),
  customerEmail: z.string().email().optional().or(z.literal('')),
  customerType: z.enum(['B2C', 'B2B']).default('B2C'),
  deliveryOption: z.enum(['DELIVERY', 'PICKUP']).default('DELIVERY'),
  deliverySlot: z.enum(['MORNING', 'MIDDAY', 'END_OF_DAY']).nullable().optional(),
  deliveryDate: z.string().nullable().optional(),
  deliveryAddress: z.string().nullable().optional(),
  deliveryFee: z.number().default(0),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string().optional(),
    quantity: z.number().positive(),
    price: z.number().positive(),
  })),
  totalAmount: z.number().positive(),
});

export async function POST(request: NextRequest) {
  // Apply rate limiting: 10 orders per 10 minutes
  const rateLimitResult = await applyRateLimit(request, RateLimitPresets.ORDER_CREATION);
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many order requests. Please try again later.' },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
        }
      }
    );
  }

  try {
    const body = await request.json();
    const data = orderSchema.parse(body);

    const order = await prisma.orderRequest.create({
      data: {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail || null,
        customerType: data.customerType,
        deliveryOption: data.deliveryOption,
        deliverySlot: data.deliverySlot || null,
        deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : null,
        deliveryAddress: data.deliveryAddress || null,
        deliveryFee: data.deliveryFee,
        notes: data.notes || null,
        totalAmount: data.totalAmount,
        status: 'PENDING',
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            variantId: item.variantId || null,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 400 }
    );
  }
}
