import Link from "next/link";
import { products, categories } from "@/data/products";

export default function HomePage() {
  const featuredProducts = products.filter((p) => p.badge === "Best Seller").slice(0, 4);
  const newArrivals = products.filter((p) => p.badge === "New").slice(0, 4);
  const onSale = products.filter((p) => p.badge === "Sale").slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/95 to-gray-900/70 z-10" />
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=600&fit=crop&crop=center"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <p className="text-blue-400 font-medium mb-3 tracking-wide uppercase text-sm">New Season Collection</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Discover Products You'll Love
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-lg">
              Shop top brands across electronics, fashion, home, and outdoor gear. Free shipping on all orders over $50.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors"
                data-testid="hero-cta-primary"
              >
                Shop Now
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/products?category=Electronics"
                className="inline-flex items-center justify-center border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-lg hover:bg-white/10 transition-colors"
                data-testid="hero-cta-secondary"
              >
                Top Electronics
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-b border-gray-200 bg-white" data-testid="trust-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Free Shipping $50+</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-sm font-medium text-gray-700">30-Day Returns</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Secure Payments</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" data-testid="categories-section">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Shop by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Browse our curated collections across all major categories</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const count = products.filter((p) => p.category === category).length;
            return (
              <Link
                key={category}
                href={`/products?category=${encodeURIComponent(category)}`}
                className="bg-white border border-gray-200 rounded-xl p-5 text-center hover:border-blue-300 hover:shadow-md transition-all group"
                data-testid={`category-${category.toLowerCase().replace(/[&\s]+/g, "-")}`}
              >
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 block">
                  {category}
                </span>
                <span className="text-xs text-gray-400 mt-1 block">{count} items</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="bg-gray-50 py-16" data-testid="bestsellers-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Best Sellers</h2>
              <p className="text-gray-600 text-sm mt-1">Our most popular products based on sales</p>
            </div>
            <Link href="/products" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group"
                data-testid={`product-card-${product.id}`}
              >
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Best Seller
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 text-sm">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-sm text-yellow-500">★</span>
                    <span className="text-xs font-medium text-gray-700">{product.rating}</span>
                    <span className="text-xs text-gray-400">({product.reviews.toLocaleString()})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" data-testid="promo-section">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative rounded-2xl overflow-hidden h-64 group">
            <img
              src="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&h=400&fit=crop&crop=center"
              alt="Electronics deal"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center p-8">
              <div>
                <p className="text-blue-300 font-medium text-sm mb-1">Limited Time</p>
                <h3 className="text-white text-2xl font-bold mb-2">Up to 30% Off Electronics</h3>
                <Link href="/products?category=Electronics" className="text-white text-sm font-medium underline underline-offset-4 hover:no-underline">
                  Shop the Sale →
                </Link>
              </div>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden h-64 group">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=400&fit=crop&crop=center"
              alt="Fashion collection"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center p-8">
              <div>
                <p className="text-pink-300 font-medium text-sm mb-1">New Arrivals</p>
                <h3 className="text-white text-2xl font-bold mb-2">Spring Fashion Edit</h3>
                <Link href="/products?category=Clothing" className="text-white text-sm font-medium underline underline-offset-4 hover:no-underline">
                  Explore Collection →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16" data-testid="new-arrivals-section">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">New Arrivals</h2>
            <p className="text-gray-600 text-sm mt-1">The latest additions to our collection</p>
          </div>
          <Link href="/products" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group"
              data-testid={`new-arrival-${product.id}`}
            >
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  New
                </span>
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 text-sm">{product.name}</h3>
                <span className="font-bold text-gray-900">${product.price.toFixed(2)}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* On Sale */}
      <section className="bg-red-50 py-16" data-testid="sale-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">On Sale Now</h2>
              <p className="text-gray-600 text-sm mt-1">Great deals you do not want to miss</p>
            </div>
            <Link href="/products" className="text-red-600 hover:text-red-700 font-medium text-sm">
              All Deals →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {onSale.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group"
                data-testid={`sale-${product.id}`}
              >
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {product.originalPrice ? `${Math.round((1 - product.price / product.originalPrice) * 100)}% OFF` : "Sale"}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 text-sm">{product.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-red-600">${product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16" data-testid="newsletter-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Get 10% Off Your First Order</h2>
            <p className="text-blue-100 mb-8 max-w-lg mx-auto">
              Subscribe to our newsletter for exclusive deals, new arrivals, and insider-only discounts.
            </p>
            <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3" data-testid="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-5 py-3.5 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                aria-label="Email address for newsletter"
                required
              />
              <button
                type="submit"
                className="bg-gray-900 text-white font-semibold px-6 py-3.5 rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-blue-200 mt-4">No spam, ever. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
