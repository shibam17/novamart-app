"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState("card");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newErrors: Record<string, string> = {};

    if (paymentMethod === "card") {
      const cardNumber = form.get("cardNumber")?.toString().replace(/\s/g, "") || "";
      if (!cardNumber) {
        newErrors.cardNumber = "Card number is required";
      } else if (!/^\d{16}$/.test(cardNumber)) {
        newErrors.cardNumber = "Please enter a valid 16-digit card number";
      }

      if (!form.get("cardName")?.toString().trim()) {
        newErrors.cardName = "Cardholder name is required";
      }

      const expiry = form.get("expiry")?.toString() || "";
      if (!expiry) {
        newErrors.expiry = "Expiration date is required";
      } else if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        newErrors.expiry = "Use MM/YY format";
      }

      const cvv = form.get("cvv")?.toString() || "";
      if (!cvv) {
        newErrors.cvv = "CVV is required";
      } else if (!/^\d{3,4}$/.test(cvv)) {
        newErrors.cvv = "Invalid CVV";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    localStorage.setItem("novamart-payment", JSON.stringify({ method: paymentMethod }));
    router.push("/checkout/confirm");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8" data-testid="checkout-steps">
        <div className="flex items-center">
          <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">✓</span>
          <span className="ml-2 text-sm text-green-600">Shipping</span>
        </div>
        <div className="w-16 h-px bg-green-500 mx-4" />
        <div className="flex items-center">
          <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">2</span>
          <span className="ml-2 text-sm font-medium text-blue-600">Payment</span>
        </div>
        <div className="w-16 h-px bg-gray-300 mx-4" />
        <div className="flex items-center">
          <span className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">3</span>
          <span className="ml-2 text-sm text-gray-500">Confirm</span>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h1>

      {/* Payment Method Tabs */}
      <div className="flex gap-4 mb-6" data-testid="payment-methods">
        <button
          onClick={() => setPaymentMethod("card")}
          className={`flex-1 py-3 px-4 border rounded-lg text-sm font-medium transition-colors ${
            paymentMethod === "card" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-300 text-gray-700"
          }`}
          data-testid="method-card"
        >
          Credit / Debit Card
        </button>
        <button
          onClick={() => setPaymentMethod("paypal")}
          className={`flex-1 py-3 px-4 border rounded-lg text-sm font-medium transition-colors ${
            paymentMethod === "paypal" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-300 text-gray-700"
          }`}
          data-testid="method-paypal"
        >
          PayPal
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" data-testid="payment-form" noValidate>
        {paymentMethod === "card" ? (
          <>
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Card Number *</label>
              <input
                id="cardNumber"
                name="cardNumber"
                type="text"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cardNumber ? "border-red-500" : "border-gray-300"}`}
                aria-invalid={!!errors.cardNumber}
              />
              {errors.cardNumber && <p className="text-red-500 text-xs mt-1" role="alert">{errors.cardNumber}</p>}
            </div>

            <div>
              <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name *</label>
              <input
                id="cardName"
                name="cardName"
                type="text"
                placeholder="John Doe"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cardName ? "border-red-500" : "border-gray-300"}`}
                aria-invalid={!!errors.cardName}
              />
              {errors.cardName && <p className="text-red-500 text-xs mt-1" role="alert">{errors.cardName}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
                <input
                  id="expiry"
                  name="expiry"
                  type="text"
                  placeholder="MM/YY"
                  maxLength={5}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.expiry ? "border-red-500" : "border-gray-300"}`}
                  aria-invalid={!!errors.expiry}
                />
                {errors.expiry && <p className="text-red-500 text-xs mt-1" role="alert">{errors.expiry}</p>}
              </div>
              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV *</label>
                <input
                  id="cvv"
                  name="cvv"
                  type="text"
                  placeholder="123"
                  maxLength={4}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cvv ? "border-red-500" : "border-gray-300"}`}
                  aria-invalid={!!errors.cvv}
                />
                {errors.cvv && <p className="text-red-500 text-xs mt-1" role="alert">{errors.cvv}</p>}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg" data-testid="paypal-section">
            <p className="text-gray-600 mb-4">You will be redirected to PayPal to complete your payment.</p>
            <div className="text-2xl font-bold text-blue-800">PayPal</div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4">
          <Link href="/checkout/shipping" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            ← Back to Shipping
          </Link>
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            data-testid="continue-to-confirm"
          >
            Review Order
          </button>
        </div>
      </form>
    </div>
  );
}
