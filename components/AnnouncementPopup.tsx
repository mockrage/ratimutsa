'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  message: string;
}

export default function AnnouncementPopup({ announcements }: { announcements: Announcement[] }) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    if (announcements.length > 0) {
      const shown = sessionStorage.getItem('announcement_shown');
      if (!shown) {
        setCurrentAnnouncement(announcements[0]);
        setIsVisible(true);
        sessionStorage.setItem('announcement_shown', 'true');
      }
    }
  }, [announcements]);

  if (!isVisible || !currentAnnouncement) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" strokeWidth={2} />
        </button>

        <div className="text-center">
          <div className="text-4xl mb-4">📢</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {currentAnnouncement.title}
          </h3>
          <p className="text-gray-600 mb-6">
            {currentAnnouncement.message}
          </p>
          <button
            onClick={() => setIsVisible(false)}
            className="btn-primary w-full"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
