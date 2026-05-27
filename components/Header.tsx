'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { getCartCount } from '@/lib/cart';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleCartUpdate = () => {
      setCartCount(getCartCount());
    };

    handleCartUpdate();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'glass shadow-luxury py-3'
          : 'bg-white/0 py-5'
      }`}
    >
      <nav className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-sm overflow-hidden transition-all duration-300 shadow-sm border border-luxury-forest-green/10">
              <Image src="/images/logo.jpg" alt="Ratimutsa Farm Logo" fill className="object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-serif font-bold tracking-wide text-luxury-charcoal">
                Ratimutsa
              </span>
              <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-luxury-windsor-oak -mt-1">
                Premium Farm
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm font-sans font-medium tracking-wide text-luxury-charcoal/80 hover:text-luxury-forest-green transition-colors duration-300 group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-luxury-forest-green transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/cart"
              className="relative group flex items-center"
              aria-label="Your order"
            >
              <ShoppingCart className="w-5 h-5 text-luxury-charcoal/70 group-hover:text-luxury-forest-green transition-colors duration-300" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-luxury-forest-green text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              href="/products"
              className="btn-primary text-xs py-2.5 px-6"
            >
              Order Now
            </Link>
          </div>

          <button
            className="md:hidden relative w-10 h-10 flex items-center justify-center text-luxury-charcoal"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ${
            isMenuOpen ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pb-6 space-y-1 border-t border-luxury-windsor-oak/10 pt-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block py-3 px-4 text-sm font-sans font-medium text-luxury-charcoal/80 hover:text-luxury-forest-green hover:bg-luxury-forest-green/5 rounded-sm transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/cart"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between py-3 px-4 text-sm font-sans font-medium text-luxury-charcoal/80 hover:text-luxury-forest-green hover:bg-luxury-forest-green/5 rounded-sm transition-all duration-200"
            >
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="w-6 h-6 bg-luxury-forest-green text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <div className="pt-4 px-4">
              <Link href="/products" className="btn-primary w-full text-center text-xs py-3">
                Order Now
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
