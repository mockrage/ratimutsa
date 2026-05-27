import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Find the original product with all its variants
    const originalProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: true,
      },
    });

    if (!originalProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Generate unique slug and name
    const timestamp = Date.now();
    const newSlug = `${originalProduct.slug}-copy-${timestamp}`;
    const newName = `${originalProduct.name} (Copy)`;

    // Create the duplicated product
    const duplicatedProduct = await prisma.product.create({
      data: {
        name: newName,
        slug: newSlug,
        description: originalProduct.description,
        price: originalProduct.price,
        unit: originalProduct.unit,
        quantity: originalProduct.quantity,
        lowStockThreshold: originalProduct.lowStockThreshold,
        imageUrl: originalProduct.imageUrl,
        images: originalProduct.images as any,
        categoryId: originalProduct.categoryId,
        isSeasonal: originalProduct.isSeasonal,
        isAvailable: false, // Set to unavailable by default
        workflowState: 'DRAFT', // Always start as draft
        // Duplicate variants
        variants: {
          create: originalProduct.variants.map(variant => ({
            name: variant.name,
            sku: `${variant.sku}-COPY-${timestamp}`, // Make SKU unique
            b2cPrice: variant.b2cPrice,
            b2bPrice: variant.b2bPrice,
            inventory: variant.inventory,
            minOrderQtyB2C: variant.minOrderQtyB2C,
            minOrderQtyB2B: variant.minOrderQtyB2B,
            unit: variant.unit,
          })),
        },
      },
      include: {
        variants: true,
        category: true,
      },
    });

    return NextResponse.json({
      success: true,
      product: duplicatedProduct,
      message: 'Product duplicated successfully',
    });
  } catch (error) {
    console.error('Product duplication error:', error);
    return NextResponse.json(
      { error: 'Failed to duplicate product' },
      { status: 500 }
    );
  }
}
