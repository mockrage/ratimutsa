'use client';

import { useRouter } from 'next/navigation';

export default function NotificationActions({ action }: { action: string }) {
  const router = useRouter();

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/admin/notifications/mark-all-read', { method: 'POST' });
      router.refresh();
    } catch (err) {
      console.error('Failed to mark notifications as read');
    }
  };

  if (action === 'markAllRead') {
    return (
      <button
        onClick={handleMarkAllRead}
        className="btn-outline text-xs py-2 px-4"
      >
        Mark All Read
      </button>
    );
  }

  return null;
}
