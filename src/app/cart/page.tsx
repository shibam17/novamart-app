"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { getCart, updateCartItemQuantity, removeFromCart, getCartTotal, CartItem } from "@/data/cart-store";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    setCart(getCart());
    const handleUpdate = () => setCart(getCart());
    window.addEventListener("cart-updated", handleUpdate);
    return () => window.removeEventListener("cart-updated", handleUpdate);
  }, []);

  const total = getCartTotal(cart);
  const shipping = total > 50 ? 0 : 9.99;
  const tax = total * 0.08;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center" data-testid="empty-cart">
        <svg className="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-6">Looks like you have not added anything to your cart yet.</p>
        <Link href="/products" className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4" data-testid="cart-items">
          {cart.map((item, index) => (
            <div
              key={`${item.productId}-${item.size}-${item.color}`}
              className={`flex gap-4 bg-white border rounded-xl p-4 transition-all ${dragOverIndex === index ? "border-blue-400 bg-blue-50" : "border-gray-200"} ${dragIndex === index ? "opacity-50" : ""}`}
              data-testid={`cart-item-${item.productId}`}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => { e.preventDefault(); setDragOverIndex(index); }}
              onDragLeave={() => setDragOverIndex(null)}
              onDrop={() => {
                if (dragIndex !== null && dragIndex !== index) {
                  const newCart = [...cart];
                  const [moved] = newCart.splice(dragIndex, 1);
                  newCart.splice(index, 0, moved);
                  setCart(newCart);
                }
                setDragIndex(null);
                setDragOverIndex(null);
              }}
              onDragEnd={() => { setDragIndex(null); setDragOverIndex(null); }}
            >
              <div className="flex items-center cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500" data-testid={`drag-handle-${item.productId}`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 2a2 2 0 10 4 2 2 0 000-4zm6 0a2 2 0 100 4 2 2 0 000-4zM7 8a2 2 0 100 4 2 2 0 000-4zm6 0a2 2 0 100 4 2 2 0 000-4zM7 14a2 2 0 100 4 2 2 0 000-4zm6 0a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
              </div>
              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {item.size !== "One Size" && `Size: ${item.size}`}
                  {item.size !== "One Size" && item.color !== "Default" && " | "}
                  {item.color !== "Default" && `Color: ${item.color}`}
                </p>
                <p className="font-bold text-gray-900 mt-2">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeFromCart(item.productId, item.size, item.color)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  aria-label={`Remove ${item.name} from cart`}
                  data-testid={`remove-${item.productId}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="flex items-center border border-gray-300 rounded">
                  <button
                    onClick={() => updateCartItemQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                    className="px-2 py-1 text-gray-600 hover:text-gray-900 text-sm"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-sm font-medium" data-testid={`qty-${item.productId}`}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartItemQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                    className="px-2 py-1 text-gray-600 hover:text-gray-900 text-sm"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 h-fit" data-testid="order-summary">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium" data-testid="subtotal">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium" data-testid="shipping">
                {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (est.)</span>
              <span className="font-medium" data-testid="tax">${tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-gray-900" data-testid="total">
                ${(total + shipping + tax).toFixed(2)}
              </span>
            </div>
          </div>
          {total < 50 && (
            <p className="text-xs text-green-600 mt-3">
              Add ${(50 - total).toFixed(2)} more for free shipping!
            </p>
          )}
          <Link
            href="/checkout/shipping"
            className="block w-full mt-6 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors text-center"
            data-testid="checkout-btn"
          >
            Proceed to Checkout
          </Link>
          <Link
            href="/products"
            className="block w-full mt-3 text-center text-sm text-blue-600 hover:text-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
