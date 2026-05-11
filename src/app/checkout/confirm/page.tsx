"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCart, getCartTotal, clearCart, CartItem } from "@/data/cart-store";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";

export default function ConfirmPage() {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const total = getCartTotal(cart);
  const shipping = total > 50 ? 0 : 9.99;
  const tax = total * 0.08;

  const handlePlaceOrder = async () => {
    setPlacing(true);
    const orderNumber = `NVM-${Date.now().toString(36).toUpperCase()}`;

    const shippingData = localStorage.getItem("novamart-shipping");
    const shippingAddress = shippingData ? JSON.parse(shippingData) : null;
    const paymentData = localStorage.getItem("novamart-payment");
    const paymentMethod = paymentData ? JSON.parse(paymentData).method : "card";

    await supabase.from("orders").insert({
      order_number: orderNumber,
      user_id: user?.id || null,
      guest_email: shippingAddress?.email || null,
      status: "confirmed",
      items: cart,
      subtotal: total,
      shipping,
      tax,
      total: total + shipping + tax,
      shipping_address: shippingAddress,
      payment_method: paymentMethod,
    });

    setOrderId(orderNumber);
    clearCart();
    localStorage.removeItem("novamart-shipping");
    localStorage.removeItem("novamart-payment");
    setOrderPlaced(true);
    setPlacing(false);
  };

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center" data-testid="order-success">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed!</h1>
        <p className="text-gray-600 mb-2">Thank you for your purchase.</p>
        <p className="text-sm text-gray-500 mb-8">
          Order ID: <span className="font-mono font-medium" data-testid="order-id">{orderId}</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/account/orders" className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            View Orders
          </Link>
          <Link href="/products" className="border border-gray-300 text-gray-700 font-semibold px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-center mb-8" data-testid="checkout-steps">
        <div className="flex items-center">
          <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">&#10003;</span>
          <span className="ml-2 text-sm text-green-600">Shipping</span>
        </div>
        <div className="w-16 h-px bg-green-500 mx-4" />
        <div className="flex items-center">
          <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">&#10003;</span>
          <span className="ml-2 text-sm text-green-600">Payment</span>
        </div>
        <div className="w-16 h-px bg-green-500 mx-4" />
        <div className="flex items-center">
          <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">3</span>
          <span className="ml-2 text-sm font-medium text-blue-600">Confirm</span>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Review Your Order</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6" data-testid="order-items">
        <h2 className="font-bold text-gray-900 mb-4">Items ({cart.length})</h2>
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{item.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6" data-testid="order-total">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span data-testid="final-total">${(total + shipping + tax).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Link href="/checkout/payment" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          &larr; Back to Payment
        </Link>
        <button
          onClick={handlePlaceOrder}
          disabled={placing}
          className="bg-green-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          data-testid="place-order-btn"
        >
          {placing ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}
