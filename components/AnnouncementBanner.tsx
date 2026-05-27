import { prisma } from '@/lib/prisma';

export default async function AnnouncementBanner() {
  const announcements = await prisma.announcement.findMany({
    where: {
      isActive: true,
      type: { in: ['BANNER', 'BOTH'] },
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } }
      ]
    },
    orderBy: { createdAt: 'desc' },
    take: 1,
  });

  if (announcements.length === 0) return null;

  const announcement = announcements[0];

  return (
    <div className="bg-luxury-forest-green text-white py-2.5 px-6 text-center relative overflow-hidden">
      <div className="absolute inset-0 pattern-overlay opacity-10" />
      <p className="relative z-10 text-xs md:text-sm font-sans font-medium tracking-wide uppercase">
        {announcement.title}: {announcement.message}
      </p>
    </div>
  );
}
