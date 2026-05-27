import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;
  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-luxury-cream">
        <section className="container mx-auto px-6 lg:px-12 py-20">
          <div className="max-w-2xl mx-auto text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-luxury-forest-green/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-10 h-10 text-luxury-forest-green" strokeWidth={1.5} />
            </div>

            <h1 className="text-4xl font-serif font-bold text-luxury-charcoal mb-4">
              Order Successfully Submitted
            </h1>
            <p className="text-lg text-gray-500 font-light mb-8 max-w-lg mx-auto">
              Thank you for your order. Our team will contact you shortly to confirm 
              availability and arrange delivery or pickup.
            </p>

            {orderId && (
              <div className="card-luxury p-6 mb-8 inline-block">
                <p className="text-xs font-sans tracking-wider uppercase text-gray-500 mb-2">Order Reference</p>
                <p className="text-xl font-sans font-bold text-luxury-forest-green">{orderId}</p>
              </div>
            )}

            <div className="space-y-4 mb-10">
              <p className="text-sm text-gray-600 font-light">
                We&apos;ll reach out to you via phone or WhatsApp to confirm your order 
                details and schedule delivery.
              </p>
              
              <div className="card-luxury p-5 text-left max-w-md mx-auto">
                <h3 className="text-xs font-sans font-semibold tracking-wider uppercase text-luxury-charcoal mb-3">
                  What Happens Next
                </h3>
                <div className="space-y-3">
                  {[
                    'We review your order and check availability',
                    'Our team contacts you to confirm details',
                    'Payment is arranged and order is processed',
                    'Your order is delivered or ready for pickup',
                  ].map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-luxury-forest-green/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-luxury-forest-green">{idx + 1}</span>
                      </span>
                      <span className="text-sm text-gray-600 font-light">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="btn-primary">
                Continue Ordering
              </Link>
              <Link href="/" className="btn-outline">
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
