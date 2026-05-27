import Link from 'next/link';
import Image from 'next/image';
import { Check } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import FloatingButtons from '@/components/FloatingButtons';
import AboutSlideshow from '@/components/AboutSlideshow';

export const dynamic = 'force-dynamic';

export default function AboutPage() {
  return (
    <>
      <AnnouncementBanner />
      <Header />
      
      <main className="min-h-screen bg-luxury-cream">
        {/* Hero */}
        <section className="relative py-24 bg-luxury-charcoal overflow-hidden">
          <div className="absolute inset-0 z-0">
            <AboutSlideshow />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-charcoal via-luxury-charcoal/60 to-transparent" />
          </div>
          <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center">
            <span className="text-luxury-windsor-oak text-xs tracking-[0.4em] uppercase font-sans font-medium">
              Our Heritage
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mt-4 mb-6">
              The Ratimutsa Story
            </h1>
            <p className="text-gray-300 font-light text-lg max-w-2xl mx-auto">
              Cultivating excellence through organic principles and a commitment to 
              quality that spans generations
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
                <div>
                  <span className="text-luxury-windsor-oak text-xs tracking-[0.4em] uppercase font-sans font-medium">
                    Our Story
                  </span>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-luxury-charcoal mt-4 mb-6">
                    Rooted in Tradition, Growing for the Future
                  </h2>
                  <p className="text-gray-600 font-light leading-relaxed mb-4">
                    Welcome to Ratimutsa Farm, where we&apos;ve been growing fresh, organic produce 
                    for over two decades. Our family-owned farm is dedicated to sustainable farming 
                    practices and providing the highest quality products to our community.
                  </p>
                  <p className="text-gray-600 font-light leading-relaxed mb-6">
                    Every product that leaves our farm carries the promise of quality, freshness, 
                    and the genuine care of farmers who treat their craft as an art form.
                  </p>
                  
                  <div className="pt-6 border-t border-luxury-windsor-oak/10">
                    <h3 className="text-sm font-sans font-semibold tracking-wider uppercase text-luxury-charcoal mb-3">
                      Our Mission
                    </h3>
                    <p className="text-gray-600 font-light italic leading-relaxed">
                      "Our mission is to provide healthy, farm-fresh, and responsibly produced meat products 
                      that nourish communities, support sustainable agriculture, and uphold the highest 
                      standards of quality and food safety."
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <div className="aspect-[4/5] overflow-hidden rounded-sm shadow-2xl">
                    <Image
                      src="/images/farm-organic.png"
                      alt="Organic Seedling"
                      fill
                      className="object-cover"
                    />
                  </div>
                  {/* Decorative element */}
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 border-2 border-luxury-windsor-oak/20 rounded-sm -z-10" />
                </div>
              </div>

              {/* Mission */}
              <div className="text-center mb-24">
                <span className="text-luxury-windsor-oak text-xs tracking-[0.4em] uppercase font-sans font-medium">
                  Our Mission
                </span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-luxury-charcoal mt-4 mb-6">
                  Nourishing Communities Responsibly
                </h2>
                <p className="text-gray-600 font-light leading-relaxed max-w-3xl mx-auto text-lg">
                  Our mission is to provide healthy, farm-fresh, and responsibly produced meat products 
                  that nourish communities, support sustainable agriculture, and uphold the highest 
                  standards of quality and food safety.
                </p>
              </div>

              {/* What We Grow */}
              <div className="mb-24">
                <div className="text-center mb-12">
                  <span className="text-luxury-windsor-oak text-xs tracking-[0.4em] uppercase font-sans font-medium">
                    Our Products
                  </span>
                  <h2 className="text-3xl font-serif font-bold text-luxury-charcoal mt-4">
                    What We Grow
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: 'Heritage Broilers',
                      description: 'Farm-raised, free-range chickens fed with natural grains for the best quality meat',
                    },
                    {
                      title: 'Farm Fresh Eggs',
                      description: 'Free-range eggs from happy hens, collected daily for maximum freshness',
                    },
                    {
                      title: 'Organic Vegetables',
                      description: 'Seasonal vegetables harvested at peak maturity for maximum nutrient density',
                    },
                    {
                      title: 'Sustainable Breeding',
                      description: 'Responsibly raised livestock with humane farming practices and quality care',
                    },
                  ].map((item) => (
                    <div key={item.title} className="card-luxury p-8 group">
                      <div>
                        <h3 className="text-xl font-serif font-bold text-luxury-charcoal mb-3">
                          {item.title}
                        </h3>
                        <p className="text-gray-500 font-light text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commitment */}
              <div className="mb-16">
                <div className="text-center mb-12">
                  <span className="text-luxury-windsor-oak text-xs tracking-[0.4em] uppercase font-sans font-medium">
                    Our Values
                  </span>
                  <h2 className="text-3xl font-serif font-bold text-luxury-charcoal mt-4">
                    Our Commitment to You
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    '100% organic farming methods without harmful pesticides',
                    'Sustainable practices that protect our environment',
                    'Fair treatment of animals with free-range practices',
                    'Supporting local community and economy',
                    'Fresh products harvested at peak ripeness',
                    'Transparent and honest business practices',
                  ].map((commitment, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-5 bg-white rounded-sm border border-gray-100">
                      <Check className="w-5 h-5 text-luxury-forest-green flex-shrink-0 mt-0.5" strokeWidth={2} />
                      <span className="text-sm text-gray-600 font-light leading-relaxed">{commitment}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="text-center p-12 bg-luxury-forest-green/5 rounded-sm">
                <h3 className="text-2xl font-serif font-bold text-luxury-charcoal mb-4">
                  Experience the Difference
                </h3>
                <p className="text-gray-500 font-light mb-8 max-w-lg mx-auto">
                  Browse our collection of premium farm products and taste the quality 
                  that generations of farming expertise delivers.
                </p>
                <Link href="/products" className="btn-primary">
                  View Our Products
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingButtons />
    </>
  );
}
