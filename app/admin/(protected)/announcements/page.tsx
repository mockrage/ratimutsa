import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import AnnouncementToggle from './AnnouncementToggle';

export default async function AdminAnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Announcements</h1>
        <Link href="/admin/announcements/new" className="btn-primary">
          + Add Announcement
        </Link>
      </div>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold">{announcement.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    announcement.type === 'BANNER' ? 'bg-blue-100 text-blue-800' :
                    announcement.type === 'POPUP' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {announcement.type}
                  </span>
                  <AnnouncementToggle
                    announcementId={announcement.id}
                    isActive={announcement.isActive}
                  />
                </div>
                <p className="text-gray-700 mb-3">{announcement.message}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Created: {new Date(announcement.createdAt).toLocaleDateString()}</span>
                  {announcement.expiresAt && (
                    <span>Expires: {new Date(announcement.expiresAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
              <Link
                href={`/admin/announcements/${announcement.id}/edit`}
                className="text-blue-600 hover:underline font-semibold ml-4"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
