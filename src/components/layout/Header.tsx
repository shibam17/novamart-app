"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCart, getCartCount } from "@/data/cart-store";

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const updateCount = () => setCartCount(getCartCount(getCart()));
    updateCount();
    window.addEventListener("cart-updated", updateCount);
    window.addEventListener("storage", updateCount);
    return () => {
      window.removeEventListener("cart-updated", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-gray-900" aria-label="NovaMart home">
            NovaMart
          </Link>

          <nav className="hidden md:flex items-center space-x-8" aria-label="Main navigation">
            <Link href="/products" className="text-gray-700 hover:text-gray-900 transition-colors">
              Products
            </Link>
            <Link href="/products?category=Electronics" className="text-gray-700 hover:text-gray-900 transition-colors">
              Electronics
            </Link>
            <Link href="/products?category=Clothing" className="text-gray-700 hover:text-gray-900 transition-colors">
              Clothing
            </Link>
            <Link href="/products?category=Home+%26+Kitchen" className="text-gray-700 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <Link href="/products?category=Sports" className="text-gray-700 hover:text-gray-900 transition-colors">
              Sports
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative" role="search">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-64 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Search products"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Submit search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            <Link href="/account" className="text-gray-700 hover:text-gray-900" aria-label="My account">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            <Link href="/cart" className="relative text-gray-700 hover:text-gray-900" aria-label={`Shopping cart with ${cartCount} items`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" data-testid="cart-count">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100" data-testid="mobile-menu">
            <nav className="flex flex-col space-y-3 pt-4" aria-label="Mobile navigation">
              <Link href="/products" className="text-gray-700 hover:text-gray-900" onClick={() => setMobileMenuOpen(false)}>
                All Products
              </Link>
              <Link href="/products?category=Electronics" className="text-gray-700 hover:text-gray-900" onClick={() => setMobileMenuOpen(false)}>
                Electronics
              </Link>
              <Link href="/products?category=Clothing" className="text-gray-700 hover:text-gray-900" onClick={() => setMobileMenuOpen(false)}>
                Clothing
              </Link>
              <Link href="/products?category=Home+%26+Kitchen" className="text-gray-700 hover:text-gray-900" onClick={() => setMobileMenuOpen(false)}>
                Home & Kitchen
              </Link>
              <Link href="/products?category=Sports" className="text-gray-700 hover:text-gray-900" onClick={() => setMobileMenuOpen(false)}>
                Sports
              </Link>
              <Link href="/cart" className="text-gray-700 hover:text-gray-900" onClick={() => setMobileMenuOpen(false)}>
                Cart ({cartCount})
              </Link>
              <Link href="/account" className="text-gray-700 hover:text-gray-900" onClick={() => setMobileMenuOpen(false)}>
                Account
              </Link>
            </nav>
            <form onSubmit={handleSearch} className="mt-4" role="search">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Search products"
              />
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
