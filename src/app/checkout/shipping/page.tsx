"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ShippingPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newErrors: Record<string, string> = {};

    const required = ["firstName", "lastName", "email", "address", "city", "state", "zip"];
    for (const field of required) {
      if (!form.get(field)?.toString().trim()) {
        newErrors[field] = "This field is required";
      }
    }

    const email = form.get("email")?.toString() || "";
    if (email && !email.includes("@")) {
      newErrors.email = "Please enter a valid email address";
    }

    const zip = form.get("zip")?.toString() || "";
    if (zip && !/^\d{5}(-\d{4})?$/.test(zip)) {
      newErrors.zip = "Please enter a valid ZIP code";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    localStorage.setItem("novamart-shipping", JSON.stringify(Object.fromEntries(form)));
    router.push("/checkout/payment");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8" data-testid="checkout-steps">
        <div className="flex items-center">
          <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">1</span>
          <span className="ml-2 text-sm font-medium text-blue-600">Shipping</span>
        </div>
        <div className="w-16 h-px bg-gray-300 mx-4" />
        <div className="flex items-center">
          <span className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">2</span>
          <span className="ml-2 text-sm text-gray-500">Payment</span>
        </div>
        <div className="w-16 h-px bg-gray-300 mx-4" />
        <div className="flex items-center">
          <span className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">3</span>
          <span className="ml-2 text-sm text-gray-500">Confirm</span>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h1>

      <form onSubmit={handleSubmit} className="space-y-6" data-testid="shipping-form" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.firstName ? "border-red-500" : "border-gray-300"}`}
              aria-invalid={!!errors.firstName}
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1" role="alert">{errors.firstName}</p>}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.lastName ? "border-red-500" : "border-gray-300"}`}
              aria-invalid={!!errors.lastName}
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1" role="alert">{errors.lastName}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? "border-red-500" : "border-gray-300"}`}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1" role="alert">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
          <input id="phone" name="phone" type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
          <input
            id="address"
            name="address"
            type="text"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address ? "border-red-500" : "border-gray-300"}`}
            aria-invalid={!!errors.address}
          />
          {errors.address && <p className="text-red-500 text-xs mt-1" role="alert">{errors.address}</p>}
        </div>

        <div>
          <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-1">Apt / Suite (optional)</label>
          <input id="address2" name="address2" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City *</label>
            <input
              id="city"
              name="city"
              type="text"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.city ? "border-red-500" : "border-gray-300"}`}
              aria-invalid={!!errors.city}
            />
            {errors.city && <p className="text-red-500 text-xs mt-1" role="alert">{errors.city}</p>}
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State *</label>
            <select
              id="state"
              name="state"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.state ? "border-red-500" : "border-gray-300"}`}
              aria-invalid={!!errors.state}
            >
              <option value="">Select</option>
              <option value="CA">California</option>
              <option value="NY">New York</option>
              <option value="TX">Texas</option>
              <option value="FL">Florida</option>
              <option value="WA">Washington</option>
              <option value="IL">Illinois</option>
              <option value="PA">Pennsylvania</option>
              <option value="OH">Ohio</option>
              <option value="GA">Georgia</option>
              <option value="NC">North Carolina</option>
            </select>
            {errors.state && <p className="text-red-500 text-xs mt-1" role="alert">{errors.state}</p>}
          </div>
          <div>
            <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
            <input
              id="zip"
              name="zip"
              type="text"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.zip ? "border-red-500" : "border-gray-300"}`}
              aria-invalid={!!errors.zip}
            />
            {errors.zip && <p className="text-red-500 text-xs mt-1" role="alert">{errors.zip}</p>}
          </div>
        </div>

        {/* Shipping Method - Radio Buttons */}
        <fieldset className="border border-gray-200 rounded-xl p-4" data-testid="shipping-method">
          <legend className="text-sm font-medium text-gray-700 px-2">Shipping Method *</legend>
          <div className="space-y-3 mt-2">
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
              <input type="radio" name="shippingMethod" value="standard" defaultChecked className="w-4 h-4 text-blue-600" data-testid="radio-standard" />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">Standard Shipping</span>
                <p className="text-xs text-gray-500">5-7 business days</p>
              </div>
              <span className="text-sm font-medium text-gray-900">Free</span>
            </label>
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
              <input type="radio" name="shippingMethod" value="express" className="w-4 h-4 text-blue-600" data-testid="radio-express" />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">Express Shipping</span>
                <p className="text-xs text-gray-500">2-3 business days</p>
              </div>
              <span className="text-sm font-medium text-gray-900">$9.99</span>
            </label>
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
              <input type="radio" name="shippingMethod" value="overnight" className="w-4 h-4 text-blue-600" data-testid="radio-overnight" />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">Overnight Shipping</span>
                <p className="text-xs text-gray-500">Next business day</p>
              </div>
              <span className="text-sm font-medium text-gray-900">$24.99</span>
            </label>
          </div>
        </fieldset>

        <div className="flex items-center justify-between pt-4">
          <Link href="/cart" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            ← Back to Cart
          </Link>
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            data-testid="continue-to-payment"
          >
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
}
