import { NextResponse } from 'next/server';
import { requireSeniorAdmin } from '@/lib/auth';
import { rejectProduct } from '@/lib/services';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await requireSeniorAdmin();
    const { notes } = await request.json();
    
    if (!notes) {
      return NextResponse.json({ error: 'Rejection notes are required' }, { status: 400 });
    }

    const product = await rejectProduct(id, session.userId!, notes);
    
    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to reject product' },
      { status: 400 }
    );
  }
}
