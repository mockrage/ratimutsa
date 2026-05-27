import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import FloatingButtons from '@/components/FloatingButtons';
import TrackOrderClient from './TrackOrderClient';

export const dynamic = 'force-dynamic';

export default function TrackOrderPage() {
  return (
    <>
      <AnnouncementBanner />
      <Header />
      
      <main className="min-h-screen bg-luxury-cream">
        <section className="relative py-16 bg-luxury-charcoal overflow-hidden">
          <div className="absolute inset-0 pattern-overlay opacity-20" />
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <span className="text-luxury-windsor-oak text-xs tracking-[0.4em] uppercase font-sans font-medium">
              Order Status
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mt-4">
              Track Your Order
            </h1>
            <p className="text-gray-300 font-light mt-2">
              Enter your order details to check the status
            </p>
          </div>
        </section>

        <section className="container mx-auto px-6 lg:px-12 py-12">
          <TrackOrderClient />
        </section>
      </main>

      <Footer />
      <FloatingButtons />
    </>
  );
}
