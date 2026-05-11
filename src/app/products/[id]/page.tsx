"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { getProductById, getRelatedProducts } from "@/data/products";
import { addToCart } from "@/data/cart-store";

export default function ProductDetailPage() {
  const params = useParams();
  const product = getProductById(params.id as string);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");
  const [wishlisted, setWishlisted] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center" data-testid="product-not-found">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-6">The product you are looking for does not exist.</p>
        <Link href="/products" className="text-blue-600 hover:text-blue-700 font-medium">
          Back to Products
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.sizes.length > 1 && !selectedSize) return;
    if (product.colors.length > 0 && !selectedColor) return;

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize || product.sizes[0] || "One Size",
      color: selectedColor || "Default",
      quantity,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const relatedProducts = getRelatedProducts(product);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm" aria-label="Breadcrumb" data-testid="breadcrumb">
        <ol className="flex items-center space-x-2 flex-wrap">
          <li><Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link></li>
          <li className="text-gray-400">/</li>
          <li><Link href="/products" className="text-gray-500 hover:text-gray-700">Products</Link></li>
          <li className="text-gray-400">/</li>
          <li><Link href={`/products?category=${encodeURIComponent(product.category)}`} className="text-gray-500 hover:text-gray-700">{product.category}</Link></li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div data-testid="product-gallery">
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4 relative">
            <img
              src={product.images[activeImage]}
              alt={`${product.name} - Image ${activeImage + 1}`}
              className="w-full h-full object-cover"
              data-testid="product-main-image"
            />
            {product.badge && (
              <span className={`absolute top-4 left-4 text-white text-xs font-bold px-3 py-1.5 rounded-full ${
                product.badge === "Sale" ? "bg-red-500" :
                product.badge === "New" ? "bg-green-500" :
                product.badge === "Best Seller" ? "bg-purple-600" :
                "bg-orange-500"
              }`} data-testid="product-badge">
                {product.badge}
              </span>
            )}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                  activeImage === i ? "border-blue-500 ring-2 ring-blue-200" : "border-transparent hover:border-gray-300"
                }`}
                aria-label={`View image ${i + 1}`}
                data-testid={`thumbnail-${i}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div data-testid="product-info">
          <div className="flex items-center gap-2 mb-2">
            <Link href={`/products?brand=${encodeURIComponent(product.brand)}`} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              {product.brand}
            </Link>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500">SKU: {product.sku}</span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4" data-testid="product-rating">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(product.rating) ? "text-yellow-400" : i < product.rating ? "text-yellow-300" : "text-gray-200"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 font-medium text-gray-900">{product.rating}</span>
            </div>
            <a href="#reviews" className="text-sm text-blue-600 hover:text-blue-700">
              {product.reviews.toLocaleString()} reviews
            </a>
            <span className="text-gray-300">|</span>
            <span className={`text-sm font-medium ${product.inStock ? "text-green-600" : "text-red-600"}`}>
              {product.inStock ? (product.stockCount <= 10 ? `Only ${product.stockCount} left` : "In Stock") : "Out of Stock"}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200" data-testid="product-price">
            <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                <span className="bg-red-100 text-red-700 text-sm font-bold px-2.5 py-1 rounded-full">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          {/* Short Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

          {/* Size Selection */}
          {product.sizes.length > 1 && (
            <div className="mb-6" data-testid="size-selector">
              <div className="flex items-center justify-between mb-2">
                <label className="font-medium text-gray-700">
                  Size {selectedSize && <span className="text-gray-500 font-normal">- {selectedSize}</span>}
                </label>
                <button className="text-xs text-blue-600 hover:text-blue-700">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2.5 border rounded-lg text-sm font-medium transition-all ${
                      selectedSize === size
                        ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500"
                        : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                    aria-label={`Select size ${size}`}
                    aria-pressed={selectedSize === size}
                    data-testid={`size-${size.replace(/\s+/g, "-").toLowerCase()}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {product.sizes.length > 1 && !selectedSize && (
                <p className="text-xs text-orange-600 mt-2" data-testid="size-required">Please select a size</p>
              )}
            </div>
          )}

          {/* Color Selection */}
          {product.colors.length > 0 && (
            <div className="mb-6" data-testid="color-selector">
              <label className="block font-medium text-gray-700 mb-2">
                Color {selectedColor && <span className="text-gray-500 font-normal">- {selectedColor}</span>}
              </label>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-10 h-10 rounded-full border-2 transition-all relative ${
                      selectedColor === color.name ? "border-blue-500 scale-110 ring-2 ring-blue-200" : "border-gray-300 hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    aria-label={`Select color ${color.name}`}
                    aria-pressed={selectedColor === color.name}
                    title={color.name}
                    data-testid={`color-${color.name.replace(/\s+/g, "-").toLowerCase()}`}
                  >
                    {selectedColor === color.name && (
                      <svg className="absolute inset-0 m-auto w-4 h-4 text-white drop-shadow" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              {product.colors.length > 0 && !selectedColor && (
                <p className="text-xs text-orange-600 mt-2" data-testid="color-required">Please select a color</p>
              )}
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6" data-testid="quantity-selector">
            <label className="block font-medium text-gray-700 mb-2">Quantity</label>
            <div className="flex items-center border border-gray-300 rounded-lg w-fit">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50 rounded-l-lg transition-colors"
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="px-6 py-2.5 font-medium min-w-[3rem] text-center border-x border-gray-300" data-testid="quantity-value">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                className="px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50 rounded-r-lg transition-colors"
                disabled={quantity >= product.stockCount}
                aria-label="Increase quantity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex-1 font-semibold py-3.5 px-6 rounded-lg transition-all ${
                addedToCart
                  ? "bg-green-600 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]"
              } disabled:bg-gray-300 disabled:cursor-not-allowed`}
              data-testid="add-to-cart-btn"
            >
              {addedToCart ? "Added to Cart!" : `Add to Cart - $${(product.price * quantity).toFixed(2)}`}
            </button>
            <button
              onClick={() => setWishlisted(!wishlisted)}
              className={`px-4 py-3.5 border rounded-lg transition-all ${
                wishlisted ? "border-red-300 bg-red-50 text-red-500" : "border-gray-300 text-gray-500 hover:border-gray-400 hover:bg-gray-50"
              }`}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              data-testid="wishlist-btn"
            >
              <svg className="w-6 h-6" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {/* Trust Badges with Hover Tooltips */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-xl" data-testid="trust-badges">
            <div className="text-center relative group" data-testid="tooltip-shipping">
              <svg className="w-6 h-6 text-green-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-xs text-gray-600">Free Shipping</p>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10" data-testid="tooltip-content-shipping">
                Free on all orders over $50
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
              </div>
            </div>
            <div className="text-center relative group" data-testid="tooltip-returns">
              <svg className="w-6 h-6 text-green-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <p className="text-xs text-gray-600">30-Day Returns</p>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10" data-testid="tooltip-content-returns">
                No questions asked return policy
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
              </div>
            </div>
            <div className="text-center relative group" data-testid="tooltip-secure">
              <svg className="w-6 h-6 text-green-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <p className="text-xs text-gray-600">Secure Checkout</p>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10" data-testid="tooltip-content-secure">
                256-bit SSL encrypted payments
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description / Specs / Reviews */}
      <div className="mt-16 border-t border-gray-200 pt-8" data-testid="product-tabs">
        <div className="flex border-b border-gray-200 mb-8">
          {(["description", "specs", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              data-testid={`tab-${tab}`}
            >
              {tab === "description" ? "Description" : tab === "specs" ? "Specifications" : `Reviews (${product.reviews.toLocaleString()})`}
            </button>
          ))}
        </div>

        {activeTab === "description" && (
          <div className="max-w-3xl" data-testid="tab-content-description">
            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
            <h3 className="font-bold text-gray-900 mb-3">Key Features</h3>
            <ul className="space-y-2">
              {product.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "specs" && (
          <div className="max-w-2xl" data-testid="tab-content-specs">
            <table className="w-full">
              <tbody>
                {Object.entries(product.specifications).map(([key, value], i) => (
                  <tr key={key} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-700 w-1/3">{key}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="max-w-3xl" data-testid="tab-content-reviews" id="reviews">
            <div className="flex items-center gap-6 mb-8 p-6 bg-gray-50 rounded-xl">
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-900">{product.rating}</p>
                <div className="flex mt-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">{product.reviews.toLocaleString()} reviews</p>
              </div>
              <div className="flex-1 space-y-1">
                {[5, 4, 3, 2, 1].map((star) => {
                  const pct = star === 5 ? 68 : star === 4 ? 22 : star === 3 ? 6 : star === 2 ? 3 : 1;
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 w-3">{star}</span>
                      <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-gray-500 w-8">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sample Reviews */}
            <div className="space-y-6" data-testid="review-list">
              {[
                { name: "Sarah M.", rating: 5, date: "2 weeks ago", title: "Absolutely love it!", text: "Exceeded my expectations. Quality is incredible and it arrived faster than expected. Would definitely buy again." },
                { name: "James K.", rating: 4, date: "1 month ago", title: "Great product, minor nitpick", text: "Overall very happy with this purchase. The only small issue is that the color is slightly different from the photos, but still looks great in person." },
                { name: "Priya R.", rating: 5, date: "1 month ago", title: "Perfect for daily use", text: "Using this every day and it has held up beautifully. The build quality is top-notch and it performs exactly as described." },
              ].map((review, i) => (
                <div key={i} className="border-b border-gray-200 pb-6" data-testid={`review-${i}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-600">{review.name.charAt(0)}</span>
                      </div>
                      <span className="font-medium text-gray-900 text-sm">{review.name}</span>
                      <span className="text-xs text-green-600 font-medium">Verified Purchase</span>
                    </div>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className={`w-4 h-4 ${j < review.rating ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <h4 className="font-medium text-gray-900 text-sm mb-1">{review.title}</h4>
                  <p className="text-sm text-gray-600">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-gray-200 pt-8" data-testid="related-products">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.id}`}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-1">{p.brand}</p>
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{p.name}</h3>
                  <span className="font-bold text-gray-900">${p.price.toFixed(2)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
