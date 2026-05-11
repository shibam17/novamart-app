"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { searchProducts } from "@/data/products";
import { Suspense } from "react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const results = query ? searchProducts(query) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Search Results</h1>
      {query && (
        <p className="text-gray-600 mb-6" data-testid="search-query">
          Showing results for &quot;{query}&quot; ({results.length} found)
        </p>
      )}

      {!query && (
        <div className="text-center py-16" data-testid="no-query">
          <p className="text-gray-500 text-lg">Enter a search term to find products.</p>
        </div>
      )}

      {query && results.length === 0 && (
        <div className="text-center py-16" data-testid="no-results">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-gray-500 text-lg mb-2">No products found for &quot;{query}&quot;</p>
          <p className="text-gray-400 text-sm mb-6">Try different keywords or browse our categories.</p>
          <Link href="/products" className="text-blue-600 hover:text-blue-700 font-medium">
            Browse All Products
          </Link>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="search-results">
          {results.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
              data-testid={`search-result-${product.id}`}
            >
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                <span className="font-bold text-gray-900">${product.price.toFixed(2)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8">Searching...</div>}>
      <SearchContent />
    </Suspense>
  );
}
