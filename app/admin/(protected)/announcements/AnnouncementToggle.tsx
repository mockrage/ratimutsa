'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AnnouncementToggle({
  announcementId,
  isActive,
}: {
  announcementId: string;
  isActive: boolean;
}) {
  const [active, setActive] = useState(isActive);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/announcements/${announcementId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !active }),
      });

      if (response.ok) {
        setActive(!active);
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to toggle announcement:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isUpdating}
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}
    >
      {active ? 'Active' : 'Inactive'}
    </button>
  );
}
