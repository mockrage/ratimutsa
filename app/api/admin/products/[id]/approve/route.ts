import { NextResponse } from 'next/server';
import { requireSeniorAdmin } from '@/lib/auth';
import { approveProduct, createNotification } from '@/lib/services';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await requireSeniorAdmin();
    const product = await approveProduct(id, session.userId!);
    
    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to approve product' },
      { status: 400 }
    );
  }
}
