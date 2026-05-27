import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import FloatingButtons from '@/components/FloatingButtons';
import AddToCartButton from './AddToCartButton';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ratimutsafarm.com';
  const productUrl = `${baseUrl}/products/${product.slug}`;

  return {
    title: `${product.name} — ${product.category.name}`,
    description: product.description,
    keywords: [
      product.name,
      product.category.name,
      'farm fresh',
      'organic',
      'Ratimutsa Farm',
      product.isSeasonal ? 'seasonal' : '',
      product.unit,
    ].filter(Boolean),
    openGraph: {
      type: 'website',
      url: productUrl,
      title: product.name,
      description: product.description,
      images: [
        {
          url: product.imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      siteName: 'Ratimutsa Farm',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [product.imageUrl],
    },
    alternates: {
      canonical: productUrl,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      variants: {
        orderBy: { b2cPrice: 'asc' },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Get related products
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isAvailable: true,
    },
    include: { category: true },
    take: 3,
  });

  return (
    <>
      <AnnouncementBanner />
      <Header />
      
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description,
            image: product.imageUrl,
            brand: {
              '@type': 'Brand',
              name: 'Ratimutsa Farm',
            },
            offers: {
              '@type': 'Offer',
              price: product.price,
              priceCurrency: 'USD',
              availability: product.isAvailable && product.quantity > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
              seller: {
                '@type': 'Organization',
                name: 'Ratimutsa Farm',
              },
            },
            category: product.category.name,
            ...(product.isSeasonal && { additionalProperty: { '@type': 'PropertyValue', name: 'Seasonal', value: 'true' } }),
          }),
        }}
      />
      
      <main className="min-h-screen bg-luxury-cream">
        {/* Breadcrumb */}
        <div className="container mx-auto px-6 lg:px-12 py-6">
          <nav className="flex items-center gap-2 text-sm font-sans text-gray-400">
            <Link href="/" className="hover:text-luxury-forest-green transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-luxury-forest-green transition-colors">Products</Link>
            <span>/</span>
            <Link href={`/products?category=${product.category.slug}`} className="hover:text-luxury-forest-green transition-colors">
              {product.category.name}
            </Link>
            <span>/</span>
            <span className="text-luxury-charcoal">{product.name}</span>
          </nav>
        </div>

        {/* Product Detail */}
        <section className="container mx-auto px-6 lg:px-12 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Product Image */}
            <div>
              <div className="relative aspect-square rounded-sm overflow-hidden bg-gray-100 card-luxury">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  {product.isSeasonal && (
                    <span className="badge-green">Seasonal</span>
                  )}
                  {product.quantity === 0 && (
                    <span className="badge-yellow">Pre-Order Available</span>
                  )}
                </div>
              </div>

              {/* Additional images */}
              {Array.isArray(product.images) && product.images.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mt-3">
                  {(product.images as string[]).slice(0, 4).map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-sm overflow-hidden bg-gray-100 card cursor-pointer">
                      <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="lg:py-4">
              <span className="text-luxury-windsor-oak text-xs tracking-[0.3em] uppercase font-sans font-medium">
                {product.category.name}
              </span>
              
              <h1 className="text-3xl md:text-4xl font-serif font-bold mt-3 mb-6 text-luxury-charcoal">
                {product.name}
              </h1>
              
              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-gray-200">
                <span className="text-4xl font-serif font-bold text-luxury-forest-green">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 font-sans">per {product.unit}</span>
              </div>

              {/* Variants */}
              {product.variants.length > 0 && (
                <div className="mb-8 p-6 bg-white rounded-sm border border-gray-100">
                  <h3 className="text-sm font-sans font-semibold tracking-wider uppercase text-luxury-charcoal mb-4">
                    Available Variants
                  </h3>
                  <div className="space-y-3">
                    {product.variants.map((variant) => (
                      <div key={variant.id} className="flex items-center justify-between py-3 px-4 bg-luxury-cream/50 rounded-sm hover:bg-luxury-cream transition-colors duration-200">
                        <div>
                          <p className="text-sm font-sans font-medium text-luxury-charcoal">{variant.name}</p>
                          <p className="text-xs text-gray-400 font-sans">SKU: {variant.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-serif font-bold text-luxury-forest-green">
                            ${variant.b2cPrice.toFixed(2)}
                          </p>
                          {variant.b2bPrice < variant.b2cPrice && (
                            <p className="text-[10px] text-luxury-windsor-oak font-sans">
                              B2B: ${variant.b2bPrice.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-sm font-sans font-semibold tracking-wider uppercase text-luxury-charcoal mb-3">
                  Description
                </h2>
                <p className="text-gray-600 font-light leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Add to Cart */}
              {product.isAvailable && product.quantity > 0 && (
                <AddToCartButton product={product} />
              )}

              {/* Pre-order option for out-of-stock */}
              {product.quantity === 0 && (
                <div className="p-6 bg-amber-50 border border-amber-200 rounded-sm mb-8">
                  <h3 className="font-serif font-bold text-amber-900 mb-2">Pre-Order Available</h3>
                  <p className="text-sm text-amber-700 font-light mb-4">
                    This product is currently out of stock. Place a pre-order and we&apos;ll notify you when it&apos;s available.
                  </p>
                  <Link href="/contact" className="btn-luxury bg-amber-600 text-white border-amber-600 hover:bg-transparent hover:text-amber-600 text-xs py-2.5">
                    Contact to Pre-Order
                  </Link>
                </div>
              )}

              {/* Farm Fresh Guarantee */}
              <div className="p-6 bg-white rounded-sm border border-luxury-windsor-oak/10">
                <div className="flex items-center gap-3 mb-3">
                  <ShieldCheck className="w-5 h-5 text-luxury-forest-green" strokeWidth={1.5} />
                  <h3 className="font-serif font-bold text-luxury-charcoal">Farm Fresh Guarantee</h3>
                </div>
                <p className="text-sm text-gray-500 font-light leading-relaxed">
                  All products are harvested fresh and delivered with care. We ensure the highest quality 
                  from our farm to your table — that&apos;s the Ratimutsa promise.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="py-20 bg-white border-t border-gray-100">
            <div className="container mx-auto px-6 lg:px-12">
              <div className="text-center mb-12">
                <span className="text-luxury-windsor-oak text-xs tracking-[0.4em] uppercase font-sans font-medium">
                  You May Also Like
                </span>
                <h2 className="text-3xl font-serif font-bold mt-4 text-luxury-charcoal">
                  Related Products
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedProducts.map((related) => (
                  <Link href={`/products/${related.slug}`} key={related.id} className="group">
                    <div className="card-luxury">
                      <div className="relative h-56 overflow-hidden bg-gray-100">
                        <Image
                          src={related.imageUrl}
                          alt={related.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-5">
                        <span className="text-[10px] tracking-[0.2em] uppercase font-sans font-medium text-luxury-windsor-oak">
                          {related.category.name}
                        </span>
                        <h3 className="text-lg font-serif font-bold mt-1.5 text-luxury-charcoal group-hover:text-luxury-forest-green transition-colors duration-300">
                          {related.name}
                        </h3>
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <span className="text-xl font-serif font-bold text-luxury-forest-green">
                            ${related.price.toFixed(2)}
                            <span className="text-xs text-gray-400 font-sans font-normal ml-1">/{related.unit}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <FloatingButtons />
    </>
  );
}
