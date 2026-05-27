'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { Bell, Menu, X } from 'lucide-react';

interface SessionData {
  userId?: string;
  email?: string;
  name?: string;
  role?: string;
  adminRole?: 'REGULAR_ADMIN' | 'SENIOR_ADMIN';
  isLoggedIn: boolean;
}

export default function AdminNav({ session }: { session: SessionData }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '' },
    { href: '/admin/products', label: 'Products', icon: '' },
    { href: '/admin/categories', label: 'Categories', icon: '' },
    { href: '/admin/orders', label: 'Orders', icon: '' },
    { href: '/admin/inventory', label: 'Inventory', icon: '' },
    { href: '/admin/announcements', label: 'Announcements', icon: '' },
    { href: '/admin/testimonials', label: 'Testimonials', icon: '' },
    { href: '/admin/harvest', label: 'Calendar', icon: '' },
  ];

  // Role-based items
  if (session.adminRole === 'SENIOR_ADMIN') {
    navItems.push(
      { href: '/admin/approvals', label: 'Approvals', icon: '' },
      { href: '/admin/audit', label: 'Audit Log', icon: '' },
      { href: '/admin/analytics', label: 'Analytics', icon: '' },
    );
  }

  return (
    <nav className="bg-luxury-charcoal border-b border-white/10">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-sm overflow-hidden bg-white">
              <Image src="/images/logo.jpg" alt="Ratimutsa Farm Logo" fill className="object-cover" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-serif font-bold text-white tracking-wide">
                Ratimutsa
              </span>
              <span className="text-[8px] tracking-[0.3em] uppercase text-luxury-windsor-oak -mt-0.5">
                Admin Panel
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-sm text-xs font-sans transition-all duration-200 ${
                  pathname === item.href
                    ? 'bg-luxury-forest-green text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-sm">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Link
              href="/admin/notifications"
              className="relative text-gray-400 hover:text-white transition-colors"
            >
              <Bell className="w-5 h-5" strokeWidth={1.5} />
            </Link>

            {/* User info */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-sans font-medium text-white">{session.name}</p>
                <p className="text-[10px] text-luxury-windsor-oak tracking-wider uppercase">
                  {session.adminRole === 'SENIOR_ADMIN' ? 'Senior Admin' : 'Admin'}
                </p>
              </div>
              <div className="w-8 h-8 bg-luxury-forest-green/20 rounded-full flex items-center justify-center">
                <span className="text-luxury-garden-lime text-xs font-bold">
                  {session.name?.charAt(0) || 'A'}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-400 text-xs font-sans transition-colors duration-200"
            >
              Logout
            </button>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden text-gray-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" strokeWidth={2} />
              ) : (
                <Menu className="w-5 h-5" strokeWidth={2} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10">
            <div className="grid grid-cols-2 gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-sm text-xs font-sans transition-all duration-200 ${
                    pathname === item.href
                      ? 'bg-luxury-forest-green text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
