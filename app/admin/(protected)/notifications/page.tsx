import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import NotificationActions from './NotificationActions';

export default async function NotificationsPage() {
  const session = await getSession();

  const notifications = await prisma.adminNotification.findMany({
    where: session.userId
      ? { OR: [{ adminId: session.userId }, { adminId: null }] }
      : {},
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getTypeIcon = (type: string) => {
    const icons: Record<string, { icon: string; bg: string }> = {
      APPROVAL_REQUIRED: { icon: '', bg: 'bg-amber-50' },
      LOW_STOCK: { icon: '', bg: 'bg-red-50' },
      CONCURRENT_EDIT: { icon: '', bg: 'bg-blue-50' },
      PREORDER_FULFILLED: { icon: '', bg: 'bg-green-50' },
    };
    return icons[type] || { icon: '', bg: 'bg-gray-50' };
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-luxury-charcoal">Notifications</h1>
          <p className="text-sm text-gray-500 font-light mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <NotificationActions action="markAllRead" />
        )}
      </div>

      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="card-luxury p-12 text-center">
            <h3 className="text-lg font-serif font-bold text-luxury-charcoal mb-2">No Notifications</h3>
            <p className="text-gray-500 font-light text-sm">You&apos;re all caught up!</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const { icon, bg } = getTypeIcon(notification.type);
            return (
              <div
                key={notification.id}
                className={`card-luxury p-5 flex items-start gap-4 transition-colors duration-300 ${
                  !notification.isRead ? 'border-l-4 border-l-luxury-forest-green bg-luxury-forest-green/[0.02]' : ''
                }`}
              >
                <div className={`w-10 h-10 ${bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <span className="text-lg">{icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="badge text-[9px] tracking-wider text-gray-500 border border-gray-200 mr-2">
                        {notification.type.replace(/_/g, ' ')}
                      </span>
                      <p className={`mt-1.5 text-sm font-sans ${!notification.isRead ? 'font-medium text-luxury-charcoal' : 'text-gray-600 font-light'}`}>
                        {notification.message}
                      </p>
                    </div>
                    <span className="text-[10px] text-gray-400 font-sans whitespace-nowrap">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
