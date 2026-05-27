import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-luxury-cream flex items-center justify-center px-6">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <h1 className="text-9xl font-serif font-bold text-luxury-forest-green/10">404</h1>
          </div>

          <h2 className="text-4xl md:text-5xl font-serif font-bold text-luxury-charcoal mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-500 font-light mb-8 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-primary inline-flex items-center gap-2">
              <Home className="w-4 h-4" strokeWidth={1.5} />
              Back to Home
            </Link>
            <button onClick={() => window.history.back()} className="btn-outline inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
              Go Back
            </button>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-400 font-sans tracking-wider uppercase mb-4">
              You might be looking for
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { href: '/products', label: 'Products' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
                { href: '/cart', label: 'Your Order' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-luxury-forest-green hover:underline font-sans"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
