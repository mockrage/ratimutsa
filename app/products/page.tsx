import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import FloatingButtons from '@/components/FloatingButtons';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    category?: string; 
    search?: string; 
    availability?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}) {
  const { 
    category: categorySlug, 
    search: searchQuery, 
    availability,
    sort,
    minPrice,
    maxPrice 
  } = await searchParams;

  const whereClause: any = {
    isAvailable: true,
    workflowState: 'PUBLISHED',
  };

  if (categorySlug) {
    whereClause.category = { slug: categorySlug };
  }

  if (searchQuery) {
    whereClause.OR = [
      { name: { contains: searchQuery, mode: 'insensitive' } },
      { description: { contains: searchQuery, mode: 'insensitive' } },
    ];
  }

  if (availability === 'in-stock') {
    whereClause.quantity = { gt: 0 };
  }

  // Price range filter
  if (minPrice || maxPrice) {
    whereClause.price = {};
    if (minPrice) whereClause.price.gte = parseFloat(minPrice);
    if (maxPrice) whereClause.price.lte = parseFloat(maxPrice);
  }

  // Sorting
  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price-asc') orderBy = { price: 'asc' };
  else if (sort === 'price-desc') orderBy = { price: 'desc' };
  else if (sort === 'name-asc') orderBy = { name: 'asc' };
  else if (sort === 'name-desc') orderBy = { name: 'desc' };

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: whereClause,
      include: { category: true, variants: true },
      orderBy,
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
    }),
  ]);

  return (
    <>
      <AnnouncementBanner />
      <Header />
      
      <main className="min-h-screen bg-luxury-cream">
        {/* Page Hero */}
        <section className="relative py-24 bg-luxury-charcoal overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/farm-landscape.png"
              alt="Premium Farm Products"
              fill
              className="object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-charcoal via-transparent to-transparent" />
          </div>
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="max-w-3xl">
              <span className="text-luxury-windsor-oak text-xs tracking-[0.4em] uppercase font-sans font-medium">
                Our Collection
              </span>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mt-4 mb-4">
                Premium Harvest
              </h1>
              <p className="text-gray-300 font-light text-lg">
                Browse our curated selection of the finest farm-fresh produce
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 lg:px-12 py-16">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 flex-shrink-0">
              {/* Search */}
              <div className="mb-8">
                <h3 className="font-serif font-semibold text-sm tracking-wider uppercase text-luxury-charcoal mb-4">
                  Search
                </h3>
                <form method="GET" action="/products">
                  <input
                    type="text"
                    name="search"
                    defaultValue={searchQuery || ''}
                    className="input-field text-sm"
                    placeholder="Search products..."
                  />
                  {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
                  {sort && <input type="hidden" name="sort" value={sort} />}
                </form>
              </div>

              {/* Sort */}
              <div className="mb-8">
                <h3 className="font-serif font-semibold text-sm tracking-wider uppercase text-luxury-charcoal mb-4">
                  Sort By
                </h3>
                <form method="GET" action="/products" id="sortForm" className="flex flex-col gap-3">
                  <select
                    name="sort"
                    defaultValue={sort || 'newest'}
                    className="input-field text-sm"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                  </select>
                  {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
                  {searchQuery && <input type="hidden" name="search" value={searchQuery} />}
                  {minPrice && <input type="hidden" name="minPrice" value={minPrice} />}
                  {maxPrice && <input type="hidden" name="maxPrice" value={maxPrice} />}
                  <button type="submit" className="btn-secondary w-full text-xs py-2">
                    Sort
                  </button>
                </form>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h3 className="font-serif font-semibold text-sm tracking-wider uppercase text-luxury-charcoal mb-4">
                  Price Range
                </h3>
                <form method="GET" action="/products" className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      name="minPrice"
                      defaultValue={minPrice || ''}
                      placeholder="Min"
                      step="0.01"
                      className="input-field text-sm"
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      defaultValue={maxPrice || ''}
                      placeholder="Max"
                      step="0.01"
                      className="input-field text-sm"
                    />
                  </div>
                  {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
                  {searchQuery && <input type="hidden" name="search" value={searchQuery} />}
                  {sort && <input type="hidden" name="sort" value={sort} />}
                  <button type="submit" className="btn-primary w-full text-xs py-2">
                    Apply
                  </button>
                </form>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h3 className="font-serif font-semibold text-sm tracking-wider uppercase text-luxury-charcoal mb-4">
                  Categories
                </h3>
                <div className="space-y-2">
                  <Link
                    href="/products"
                    className={`block py-2.5 px-4 text-sm font-sans transition-all duration-300 rounded-sm ${
                      !categorySlug
                        ? 'bg-luxury-forest-green text-white font-medium'
                        : 'text-gray-600 hover:bg-luxury-forest-green/5 hover:text-luxury-forest-green'
                    }`}
                  >
                    All Products
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/products?category=${category.slug}`}
                      className={`block py-2.5 px-4 text-sm font-sans transition-all duration-300 rounded-sm ${
                        categorySlug === category.slug
                          ? 'bg-luxury-forest-green text-white font-medium'
                          : 'text-gray-600 hover:bg-luxury-forest-green/5 hover:text-luxury-forest-green'
                      }`}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="mb-8">
                <h3 className="font-serif font-semibold text-sm tracking-wider uppercase text-luxury-charcoal mb-4">
                  Availability
                </h3>
                <div className="space-y-2">
                  <Link
                    href={`/products${categorySlug ? `?category=${categorySlug}` : ''}`}
                    className={`block py-2.5 px-4 text-sm font-sans transition-all duration-300 rounded-sm ${
                      !availability
                        ? 'bg-luxury-forest-green text-white font-medium'
                        : 'text-gray-600 hover:bg-luxury-forest-green/5 hover:text-luxury-forest-green'
                    }`}
                  >
                    All
                  </Link>
                  <Link
                    href={`/products?availability=in-stock${categorySlug ? `&category=${categorySlug}` : ''}`}
                    className={`block py-2.5 px-4 text-sm font-sans transition-all duration-300 rounded-sm ${
                      availability === 'in-stock'
                        ? 'bg-luxury-forest-green text-white font-medium'
                        : 'text-gray-600 hover:bg-luxury-forest-green/5 hover:text-luxury-forest-green'
                    }`}
                  >
                    In Stock
                  </Link>
                </div>
              </div>

              {/* Active Filters */}
              {(categorySlug || searchQuery || availability || minPrice || maxPrice) && (
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs tracking-wider uppercase text-gray-500 font-sans">Active Filters</span>
                    <Link href="/products" className="text-xs text-luxury-forest-green hover:underline font-sans">
                      Clear All
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categorySlug && (
                      <span className="badge-green text-[10px]">
                        {categorySlug}
                      </span>
                    )}
                    {searchQuery && (
                      <span className="badge-gold text-[10px]">
                        &ldquo;{searchQuery}&rdquo;
                      </span>
                    )}
                    {availability && (
                      <span className="badge-blue text-[10px]">
                        {availability}
                      </span>
                    )}
                    {minPrice && (
                      <span className="badge text-[10px] bg-purple-50 text-purple-700 border-purple-200">
                        Min: ${minPrice}
                      </span>
                    )}
                    {maxPrice && (
                      <span className="badge text-[10px] bg-purple-50 text-purple-700 border-purple-200">
                        Max: ${maxPrice}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              {/* Results count */}
              <div className="flex items-center justify-between mb-8">
                <p className="text-sm text-gray-500 font-sans">
                  Showing <strong className="text-luxury-charcoal">{products.length}</strong> products
                </p>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-20 card-luxury">
                  <h3 className="text-xl font-serif font-bold mb-2 text-luxury-charcoal">No Products Found</h3>
                  <p className="text-gray-500 font-light mb-6">
                    Try adjusting your filters or search terms
                  </p>
                  <Link href="/products" className="btn-secondary text-xs">
                    View All Products
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {products.map((product) => (
                    <Link href={`/products/${product.slug}`} key={product.id} className="group">
                      <div className="card-luxury">
                        <div className="relative h-64 overflow-hidden bg-gray-100">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          
                          <div className="absolute top-4 left-4 flex flex-col gap-2">
                            {product.isSeasonal && (
                              <span className="badge-green text-[10px]">Seasonal</span>
                            )}
                            {product.quantity === 0 && (
                              <span className="badge-yellow text-[10px]">Pre-Order</span>
                            )}
                          </div>

                          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                            <span className="btn-luxury bg-white/90 text-luxury-charcoal w-full text-center text-xs py-2.5 block backdrop-blur-sm">
                              View Details
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-5">
                          <span className="text-[10px] tracking-[0.2em] uppercase font-sans font-medium text-luxury-windsor-oak">
                            {product.category.name}
                          </span>
                          <h3 className="text-lg font-serif font-bold mt-1.5 mb-2 text-luxury-charcoal group-hover:text-luxury-forest-green transition-colors duration-300">
                            {product.name}
                          </h3>
                          <p className="text-gray-500 text-sm font-light mb-3 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <span className="text-xl font-serif font-bold text-luxury-forest-green">
                              ${product.price.toFixed(2)}
                              <span className="text-xs text-gray-400 font-sans font-normal ml-1">/{product.unit}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingButtons />
    </>
  );
}
