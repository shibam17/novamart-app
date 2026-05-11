"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { products, categories } from "@/data/products";
import { useState, useMemo, Suspense } from "react";

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const allBrands = useMemo(() => {
    const brands = [...new Set(products.map((p) => p.brand))];
    return brands.sort();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (categoryParam) {
      filtered = filtered.filter((p) => p.category === categoryParam);
    }

    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) => selectedBrands.includes(p.brand));
    }

    if (showInStockOnly) {
      filtered = filtered.filter((p) => p.inStock);
    }

    switch (sortBy) {
      case "price-asc":
        return [...filtered].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...filtered].sort((a, b) => b.price - a.price);
      case "rating":
        return [...filtered].sort((a, b) => b.rating - a.rating);
      case "reviews":
        return [...filtered].sort((a, b) => b.reviews - a.reviews);
      case "name":
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      case "newest":
        return [...filtered].filter((p) => p.badge === "New").concat(filtered.filter((p) => p.badge !== "New"));
      default:
        return filtered;
    }
  }, [categoryParam, sortBy, priceRange, selectedBrands, showInStockOnly]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setPriceRange([0, 2000]);
    setShowInStockOnly(false);
    setSortBy("featured");
  };

  const hasActiveFilters = selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < 2000 || showInStockOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {categoryParam || "All Products"}
        </h1>
        <p className="text-gray-600 mt-1">
          {categoryParam
            ? `Browse our ${categoryParam.toLowerCase()} collection`
            : "Discover our complete range of products"}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 shrink-0" data-testid="filters-sidebar">
          <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Filters</h2>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  data-testid="clear-filters"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3 text-sm">Category</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/products"
                    className={`text-sm block py-1 ${!categoryParam ? "text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900"}`}
                  >
                    All Products ({products.length})
                  </Link>
                </li>
                {categories.map((cat) => {
                  const count = products.filter((p) => p.category === cat).length;
                  return (
                    <li key={cat}>
                      <Link
                        href={`/products?category=${encodeURIComponent(cat)}`}
                        className={`text-sm block py-1 flex justify-between ${categoryParam === cat ? "text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900"}`}
                        data-testid={`filter-${cat.toLowerCase().replace(/[&\s]+/g, "-")}`}
                      >
                        <span>{cat}</span>
                        <span className="text-gray-400">{count}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Brand Filter */}
            <div className="mb-6 pb-6 border-b border-gray-200" data-testid="brand-filter">
              <h3 className="font-medium text-gray-900 mb-3 text-sm">Brand</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {allBrands.map((brand) => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6 pb-6 border-b border-gray-200" data-testid="price-filter">
              <h3 className="font-medium text-gray-900 mb-3 text-sm">Price Range</h3>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                  <input
                    type="number"
                    min={0}
                    max={2000}
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded-lg text-sm"
                    aria-label="Minimum price"
                  />
                </div>
                <span className="text-gray-400 text-sm">to</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                  <input
                    type="number"
                    min={0}
                    max={2000}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded-lg text-sm"
                    aria-label="Maximum price"
                  />
                </div>
              </div>
            </div>

            {/* Availability */}
            <div data-testid="availability-filter">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInStockOnly}
                  onChange={(e) => setShowInStockOnly(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">In Stock Only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 bg-white border border-gray-200 rounded-lg p-3">
            <p className="text-sm text-gray-600" data-testid="product-count">
              <span className="font-medium text-gray-900">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="hidden sm:flex items-center border border-gray-300 rounded-lg overflow-hidden" data-testid="view-toggle">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                  aria-label="Grid view"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zm8 0A1.5 1.5 0 0110.5 1h3A1.5 1.5 0 0115 2.5v3A1.5 1.5 0 0113.5 7h-3A1.5 1.5 0 019 5.5v-3zm-8 8A1.5 1.5 0 012.5 9h3A1.5 1.5 0 017 10.5v3A1.5 1.5 0 015.5 15h-3A1.5 1.5 0 011 13.5v-3zm8 0A1.5 1.5 0 0110.5 9h3a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 019 13.5v-3z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                  aria-label="List view"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M2.5 12a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5z" />
                  </svg>
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Sort products"
                data-testid="sort-select"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviewed</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-4" data-testid="active-filters">
              {selectedBrands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => toggleBrand(brand)}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-100"
                >
                  {brand}
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              ))}
              {(priceRange[0] > 0 || priceRange[1] < 2000) && (
                <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                  ${priceRange[0]} - ${priceRange[1]}
                </span>
              )}
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white border border-gray-200 rounded-xl" data-testid="no-products">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-gray-500 text-lg mb-2">No products found</p>
              <p className="text-gray-400 text-sm mb-4">Try adjusting your filters or search criteria.</p>
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Clear All Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" data-testid="product-grid">
              {filteredProducts.map((product) => (
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
                    {product.badge && (
                      <span className={`absolute top-3 left-3 text-white text-xs font-bold px-2.5 py-1 rounded-full ${
                        product.badge === "Sale" ? "bg-red-500" :
                        product.badge === "New" ? "bg-green-500" :
                        product.badge === "Best Seller" ? "bg-purple-600" :
                        "bg-orange-500"
                      }`}>
                        {product.badge}
                      </span>
                    )}
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
                    {product.stockCount <= 10 && product.inStock && (
                      <p className="text-xs text-orange-600 mt-1">Only {product.stockCount} left</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4" data-testid="product-list">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="flex gap-4 bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all p-4"
                  data-testid={`product-card-${product.id}`}
                >
                  <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-0.5">{product.brand}</p>
                    <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-sm text-yellow-500">★</span>
                      <span className="text-xs font-medium">{product.rating}</span>
                      <span className="text-xs text-gray-400">({product.reviews.toLocaleString()} reviews)</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{product.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-gray-900">${product.price.toFixed(2)}</span>
                      {product.originalPrice && (
                        <>
                          <span className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
