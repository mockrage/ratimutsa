import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-luxury-charcoal text-white relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 pattern-overlay opacity-30" />
      
      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-6 lg:px-12 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-10 h-10 rounded-sm overflow-hidden bg-white">
                  <Image src="/images/logo.jpg" alt="Ratimutsa Farm Logo" fill className="object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-serif font-bold tracking-wide">
                    Ratimutsa
                  </span>
                  <span className="text-[10px] tracking-[0.3em] uppercase text-luxury-windsor-oak -mt-1">
                    Premium Farm
                  </span>
                </div>
              </div>
              <p className="text-gray-400 font-light text-sm leading-relaxed mb-6">
                Cultivating excellence since generations. Experience the finest
                farm-fresh produce, raised with care and delivered with pride.
              </p>
              <div className="flex gap-4">
                <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '263779527507'}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-9 h-9 rounded-sm bg-white/5 hover:bg-luxury-forest-green flex items-center justify-center transition-all duration-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                </a>
                <a href={`https://www.instagram.com/${process.env.NEXT_PUBLIC_INSTAGRAM || 'ratimutsa_farms'}`} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-sm bg-white/5 hover:bg-luxury-forest-green flex items-center justify-center transition-all duration-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href={`https://www.facebook.com/${encodeURIComponent(process.env.NEXT_PUBLIC_FACEBOOK || 'Ratimutsa Farms')}`} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-sm bg-white/5 hover:bg-luxury-forest-green flex items-center justify-center transition-all duration-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-serif font-semibold text-sm tracking-wider uppercase mb-6 text-luxury-windsor-oak">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {[
                  { href: '/products', label: 'Our Products' },
                  { href: '/about', label: 'About Us' },
                  { href: '/contact', label: 'Contact' },
                  { href: '/cart', label: 'Your Order' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm font-light transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-0 h-px bg-luxury-garden-lime transition-all duration-300 group-hover:w-4" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-serif font-semibold text-sm tracking-wider uppercase mb-6 text-luxury-windsor-oak">
                Categories
              </h4>
              <ul className="space-y-3">
                {[
                  { href: '/products?category=poultry', label: 'Poultry' },
                  { href: '/products?category=vegetables', label: 'Vegetables' },
                  { href: '/products?category=livestock', label: 'Livestock' },
                  { href: '/products?category=eggs', label: 'Eggs' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm font-light transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-0 h-px bg-luxury-garden-lime transition-all duration-300 group-hover:w-4" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-serif font-semibold text-sm tracking-wider uppercase mb-6 text-luxury-windsor-oak">
                Get In Touch
              </h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 mt-0.5 text-luxury-windsor-oak flex-shrink-0" strokeWidth={1.5} />
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-400 font-light">
                      {process.env.NEXT_PUBLIC_PHONE_NUMBER || '+263 779 527 507'}
                    </span>
                    <span className="text-gray-400 font-light">
                      {process.env.NEXT_PUBLIC_PHONE_NUMBER_SECONDARY || '+263 779 527 503'}
                    </span>
                    <span className="text-gray-400 font-light">
                      {process.env.NEXT_PUBLIC_PHONE_NUMBER_TERTIARY || '+263 779 527 560'}
                    </span>
                    <span className="text-gray-400 font-light">
                      {process.env.NEXT_PUBLIC_PHONE_NUMBER_QUATERNARY || '+263 779 527 553'}
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-4 h-4 mt-0.5 text-luxury-windsor-oak flex-shrink-0" strokeWidth={1.5} />
                  <span className="text-gray-400 font-light">
                    {process.env.NEXT_PUBLIC_EMAIL || 'sales@ratimutsa.co.zw'}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 text-luxury-windsor-oak flex-shrink-0" strokeWidth={1.5} />
                  <span className="text-gray-400 font-light">
                    {process.env.NEXT_PUBLIC_ADDRESS || 'Musami, Murehwa District Zimbabwe'}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="container mx-auto px-6 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs font-light tracking-wider">
              &copy; {new Date().getFullYear()} Ratimutsa Farm. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-gray-600 text-[10px] tracking-[0.2em] uppercase">
                Crafted with care
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-luxury-windsor-oak/40"></span>
              <span className="text-gray-600 text-[10px] tracking-[0.2em] uppercase">
                Delivered with pride
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
