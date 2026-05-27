import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AuditLogPage() {
  const session = await getSession();
  if (session.adminRole !== 'SENIOR_ADMIN') {
    redirect('/admin');
  }

  const auditLogs = await prisma.auditLog.findMany({
    include: { admin: { select: { name: true, email: true } } },
    orderBy: { timestamp: 'desc' },
    take: 100,
  });

  const getActionBadge = (action: string) => {
    const badges: Record<string, string> = {
      CREATE: 'badge-green',
      UPDATE: 'badge-blue',
      DELETE: 'badge-red',
      APPROVE: 'badge-green',
      REJECT: 'badge-red',
      SUBMIT: 'badge-yellow',
    };
    return badges[action] || 'badge';
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-luxury-charcoal">Audit Log</h1>
        <p className="text-sm text-gray-500 font-light mt-1">
          Track all administrative actions and changes
        </p>
      </div>

      <div className="card-luxury overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Admin</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Entity ID</th>
                <th>Changes</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td className="text-xs text-gray-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td>
                    <p className="font-sans font-medium text-sm">{log.admin.name}</p>
                    <p className="text-[10px] text-gray-400">{log.admin.email}</p>
                  </td>
                  <td>
                    <span className={getActionBadge(log.action)}>{log.action}</span>
                  </td>
                  <td className="font-sans text-sm text-luxury-charcoal">{log.entityType}</td>
                  <td className="font-sans text-[10px] text-gray-400">{log.entityId.slice(0, 8)}</td>
                  <td className="max-w-xs">
                    <pre className="text-[10px] text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
                      {JSON.stringify(log.changes)}
                    </pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {auditLogs.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 font-light">No audit entries yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
