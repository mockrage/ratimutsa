import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import AdminNav from './AdminNav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session.isLoggedIn) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav session={{
        userId: session.userId,
        email: session.email,
        name: session.name,
        role: session.role,
        adminRole: session.adminRole,
        isLoggedIn: session.isLoggedIn
      }} />
      <main className="container mx-auto px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
