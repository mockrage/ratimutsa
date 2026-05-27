import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import FloatingButtons from '@/components/FloatingButtons';
import CheckoutClient from './CheckoutClient';

export default function CheckoutPage() {
  return (
    <>
      <AnnouncementBanner />
      <Header />
      
      <main className="min-h-screen bg-luxury-cream">
        <section className="relative py-16 bg-luxury-charcoal overflow-hidden">
          <div className="absolute inset-0 pattern-overlay opacity-20" />
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <span className="text-luxury-windsor-oak text-xs tracking-[0.4em] uppercase font-sans font-medium">
              Secure Checkout
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mt-4">
              Complete Your Order
            </h1>
          </div>
        </section>

        <section className="container mx-auto px-6 lg:px-12 py-12">
          <CheckoutClient />
        </section>
      </main>

      <Footer />
      <FloatingButtons />
    </>
  );
}
