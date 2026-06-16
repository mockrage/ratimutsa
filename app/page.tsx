import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown, ShieldCheck, Clock, Leaf, Star } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import AnnouncementPopup from '@/components/AnnouncementPopup';
import FloatingButtons from '@/components/FloatingButtons';
import HeroSlideshow from '@/components/HeroSlideshow';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [featuredProducts, testimonials, announcements] = await Promise.all([
    prisma.product.findMany({
      where: { isAvailable: true },
      include: { category: true, variants: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.testimonial.findMany({
      where: { isActive: true },
      take: 3,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.announcement.findMany({
      where: {
        isActive: true,
        type: { in: ['POPUP', 'BOTH'] },
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 1,
    }),
  ]);

  return (
    <>
      <AnnouncementBanner />
      <Header />

      <main>
        {/* ===== HERO SECTION ===== */}
        <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
          {/* Background Image Slideshow with Overlay */}
          <HeroSlideshow />
          <div className="absolute inset-0 pattern-overlay opacity-10 z-0" />

          {/* Decorative elements */}
          <div className="absolute top-20 right-20 w-64 h-64 bg-luxury-garden-lime/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-luxury-windsor-oak/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

          <div className="relative z-10 container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl mx-auto text-center">
              {/* Elegant pre-title */}
              <div className="animate-reveal flex items-center justify-center gap-4 mb-8">
                <span className="h-px w-12 bg-luxury-windsor-oak" />
                <span className="text-luxury-windsor-oak text-xs tracking-[0.4em] uppercase font-sans font-medium">
                  Premium Agricultural Marketplace
                </span>
                <span className="h-px w-12 bg-luxury-windsor-oak" />
              </div>

              <h1 className="animate-reveal-delay-1 text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-8 leading-[0.95] tracking-tight">
                From Our Fields,
                <br />
                <span className="text-gradient-green bg-gradient-to-r from-luxury-garden-lime to-emerald-300 bg-clip-text text-transparent">
                  To Your Table
                </span>
              </h1>

              <p className="animate-reveal-delay-2 text-lg md:text-xl text-gray-300 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
                Experience the finest farm-fresh produce — premium broilers,
                farm eggs, organic vegetables — cultivated with care and delivered
                with pride by Ratimutsa Farm.
              </p>

              <div className="animate-reveal-delay-3 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products" className="btn-primary bg-white text-luxury-forest-green border-white hover:bg-transparent hover:text-white">
                  Explore Products
                </Link>
                <Link href="/about" className="btn-secondary border-white/30 text-white hover:bg-white hover:text-luxury-forest-green">
                  Our Story
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="animate-reveal-delay-3 mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-12">
                {[
                  { value: '100%', label: 'Organic' },
                  { value: '24hr', label: 'Fresh Delivery' },
                  { value: '5+', label: 'Years Experience' },
                  { value: '1000+', label: 'Happy Customers' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-2xl font-serif font-bold text-white">{stat.value}</p>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-sans mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <ArrowDown className="w-5 h-5 text-white/40" strokeWidth={1.5} />
          </div>
        </section>

        {/* ===== CATEGORY SHOWCASE ===== */}
        <section className="py-24 bg-luxury-cream">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <span className="text-luxury-windsor-oak text-xs tracking-[0.4em] uppercase font-sans font-medium">
                Our Specialties
              </span>
              <h2 className="section-title mt-4">Premium Agricultural Categories</h2>
              <p className="section-subtitle text-gray-600">
                Experience the difference of heritage breeding and organic cultivation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Heritage Broilers', image: '/images/Broilers.jfif', count: 'Premium Grade' },
                { name: 'Organic Vegetables', image: '/images/farm-vegetables.png', count: 'Daily Harvest' },
                { name: 'Farm Fresh Eggs', image: '/images/Eggs.jfif', count: 'Direct from Farm' },
                { name: 'Agricultural Solutions', image: '/images/hero-farm.png', count: 'Expert Support' },
              ].map((cat) => (
                <div key={cat.name} className="group relative h-80 overflow-hidden cursor-pointer">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-charcoal/90 via-luxury-charcoal/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-[10px] tracking-[0.3em] uppercase text-luxury-garden-lime font-sans font-bold mb-1">
                      {cat.count}
                    </p>
                    <h3 className="text-xl font-serif font-bold text-white">
                      {cat.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FEATURED PRODUCTS ===== */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <span className="text-luxury-windsor-oak text-xs tracking-[0.4em] uppercase font-sans font-medium">
                Today&apos;s Fresh Pick
              </span>
              <h2 className="section-title mt-4">Featured Harvest</h2>
              <p className="section-subtitle">
                Quality you can taste in every bite
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <Link href={`/products/${product.slug}`} key={product.id} className="group">
                  <div className="card-luxury">
                    <div className="relative h-72 overflow-hidden bg-gray-100">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.isSeasonal && (
                          <span className="badge-green text-[10px]">Seasonal</span>
                        )}
                      </div>

                      {/* Quick view button on hover */}
                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                        <span className="btn-luxury bg-white/90 text-luxury-charcoal w-full text-center text-xs py-2.5 block backdrop-blur-sm">
                          View Details
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <span className="text-[10px] tracking-[0.2em] uppercase font-sans font-medium text-luxury-windsor-oak">
                        {product.category.name}
                      </span>
                      <h3 className="text-xl font-serif font-bold mt-2 mb-3 text-luxury-charcoal group-hover:text-luxury-forest-green transition-colors duration-300">
                        {product.name}
                      </h3>
                      <p className="text-gray-500 text-sm font-light mb-4 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-2xl font-serif font-bold text-luxury-forest-green">
                          ${product.price.toFixed(2)}
                          <span className="text-xs text-gray-400 font-sans font-normal ml-1">/{product.unit}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-16">
              <Link href="/products" className="btn-secondary">
                View All Products
              </Link>
            </div>
          </div>
        </section>

        {/* ===== SIGNATURE PRODUCE (Alternating) ===== */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <span className="text-luxury-windsor-oak text-xs tracking-[0.4em] uppercase font-sans font-medium">
                Signature Collection
              </span>
              <h2 className="section-title mt-4">Discover Our Specialties</h2>
            </div>

            <div className="space-y-24">
              {/* Eggs Section */}
              <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
                <div className="md:w-1/2">
                  <div className="relative group">
                    <div className="aspect-[4/3] overflow-hidden rounded-sm shadow-2xl">
                      <Image
                        src="/images/Eggs.jfif"
                        alt="Farm Fresh Eggs"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    {/* Floating image overlap */}
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 hidden lg:block rounded-sm overflow-hidden shadow-xl border-4 border-white animate-float z-10">
                      <Image
                        src="/images/eggs1.jfif"
                        alt="Organic Eggs"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2">
                  <span className="text-luxury-garden-lime text-[10px] tracking-[0.3em] uppercase font-sans font-bold">
                    Direct from Nest
                  </span>
                  <h3 className="text-3xl md:text-4xl font-serif font-bold text-luxury-charcoal mt-4 mb-6">
                    Farm Fresh Heritage Eggs
                  </h3>
                  <p className="text-gray-500 font-light leading-relaxed mb-8 text-lg">
                    Our free-range hens are raised with the highest welfare standards,
                    resulting in eggs with vibrant yolks and rich flavor. Collected
                    daily and delivered within 24 hours for unparalleled freshness.
                  </p>
                  <Link href="/products?category=poultry" className="btn-luxury inline-flex">
                    Explore Poultry
                  </Link>
                </div>
              </div>

              {/* Vegetables Section (Alternated) */}
              <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-24">
                <div className="md:w-1/2">
                  <div className="relative group">
                    <div className="aspect-[4/3] overflow-hidden rounded-sm shadow-2xl">
                      <Image
                        src="/images/farmpage.jpg"
                        alt="Organic Vegetables"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    {/* Floating image overlap */}
                    <div className="absolute -bottom-10 -left-10 w-48 h-48 hidden lg:block rounded-sm overflow-hidden shadow-xl border-4 border-white animate-float z-10" style={{ animationDelay: '2s' }}>
                      <Image
                        src="/images/tomato.png"
                        alt="Vine Tomatoes"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2">
                  <span className="text-luxury-garden-lime text-[10px] tracking-[0.3em] uppercase font-sans font-bold">
                    Organic Harvest
                  </span>
                  <h3 className="text-3xl md:text-4xl font-serif font-bold text-luxury-charcoal mt-4 mb-6">
                    Pesticide-Free Vegetables
                  </h3>
                  <p className="text-gray-500 font-light leading-relaxed mb-8 text-lg">
                    Cultivated in nutrient-rich soil using traditional organic methods.
                    From crisp greens to sun-ripened tomatoes, every harvest is a
                    testament to our commitment to nature and your health.
                  </p>
                  <Link href="/products?category=vegetables" className="btn-luxury inline-flex">
                    Order Vegetables
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== WHY CHOOSE US ===== */}
        <section className="py-24 bg-luxury-cream relative overflow-hidden">
          <div className="absolute inset-0 pattern-overlay opacity-50" />
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="text-center mb-16">
              <span className="text-luxury-windsor-oak text-xs tracking-[0.4em] uppercase font-sans font-medium">
                Our Promise
              </span>
              <h2 className="section-title mt-4">Why Ratimutsa Farm</h2>
              <p className="section-subtitle">
                A commitment to excellence that spans every part of our process
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  icon: <ShieldCheck className="w-8 h-8" strokeWidth={1.5} />,
                  title: '100% Organic',
                  description: 'Grown without harmful chemicals or pesticides. Our commitment to organic practices ensures pure, natural produce.',
                },
                {
                  icon: <Clock className="w-8 h-8" strokeWidth={1.5} />,
                  title: 'Farm Fresh Daily',
                  description: 'Harvested at peak ripeness and delivered within hours. Experience produce as nature intended — vibrant and flavorful.',
                },
                {
                  icon: <Leaf className="w-8 h-8" strokeWidth={1.5} />,
                  title: 'Sustainable Practice',
                  description: 'Protecting our environment for future generations through responsible farming methods and eco-conscious operations.',
                },
              ].map((feature) => (
                <div key={feature.title} className="card-luxury p-8 lg:p-10 text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-luxury-forest-green/5 text-luxury-forest-green rounded-sm mb-6 transition-all duration-300 group-hover:bg-luxury-forest-green group-hover:text-white">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-3 text-luxury-charcoal">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 font-light text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== TESTIMONIALS ===== */}
        {testimonials.length > 0 && (
          <section className="py-24 bg-white">
            <div className="container mx-auto px-6 lg:px-12">
              <div className="text-center mb-16">
                <span className="text-luxury-windsor-oak text-xs tracking-[0.4em] uppercase font-sans font-medium">
                  Testimonials
                </span>
                <h2 className="section-title mt-4">What Our Clients Say</h2>
                <p className="section-subtitle">
                  The trust of our customers is the cornerstone of our excellence
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="card-luxury p-8">
                    {/* Quote mark */}
                    <div className="text-4xl font-serif text-luxury-windsor-oak/20 mb-4 leading-none">“</div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-luxury-windsor-oak fill-luxury-windsor-oak" />
                      ))}
                    </div>

                    <p className="text-gray-600 font-light leading-relaxed mb-6 italic">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>

                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <div className="w-10 h-10 bg-luxury-forest-green/10 rounded-full flex items-center justify-center">
                        <span className="text-luxury-forest-green font-serif font-bold text-sm">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-sans font-semibold text-sm text-luxury-charcoal">
                          {testimonial.name}
                        </p>
                        {testimonial.location && (
                          <p className="text-xs text-gray-400 font-light">{testimonial.location}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== CTA SECTION ===== */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-luxury-forest-green via-luxury-forest-green to-luxury-charcoal" />
          <div className="absolute inset-0 pattern-overlay opacity-10" />

          <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
            <span className="text-luxury-windsor-oak text-xs tracking-[0.4em] uppercase font-sans font-medium">
              Start Ordering
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mt-4 mb-6">
              Ready for Premium,<br />Farm-Fresh Produce?
            </h2>
            <p className="text-gray-300 font-light text-lg mb-10 max-w-xl mx-auto">
              Browse our curated selection of the finest agricultural products
              and experience the Ratimutsa difference.
            </p>
            <Link
              href="/products"
              className="btn-luxury bg-white text-luxury-forest-green border-white hover:bg-transparent hover:text-white inline-flex"
            >
              Order Our Collection
            </Link>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingButtons />
      <AnnouncementPopup announcements={announcements} />
    </>
  );
}
