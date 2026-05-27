import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    
    await prisma.adminNotification.updateMany({
      where: {
        isRead: false,
        OR: [{ adminId: session.userId }, { adminId: null }],
      },
      data: { isRead: true },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to mark notifications as read' },
      { status: 400 }
    );
  }
}
