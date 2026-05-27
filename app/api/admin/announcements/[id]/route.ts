import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { z } from 'zod';

const announcementSchema = z.object({
  isActive: z.boolean(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireAdmin();
    
    const body = await request.json();
    const { isActive } = announcementSchema.parse(body);

    const announcement = await prisma.announcement.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json({ success: true, announcement });
  } catch (error) {
    console.error('Announcement update error:', error);
    return NextResponse.json(
      { error: 'Failed to update announcement' },
      { status: 400 }
    );
  }
}
