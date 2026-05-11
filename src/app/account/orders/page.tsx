"use client";

import Link from "next/link";

const mockOrders = [
  {
    id: "NVM-A1B2C3",
    date: "2026-05-01",
    status: "Delivered",
    total: 329.97,
    items: 3,
  },
  {
    id: "NVM-D4E5F6",
    date: "2026-04-22",
    status: "Shipped",
    total: 159.99,
    items: 1,
  },
  {
    id: "NVM-G7H8I9",
    date: "2026-04-10",
    status: "Delivered",
    total: 94.98,
    items: 2,
  },
];

export default function OrdersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
        <Link href="/account" className="text-sm text-blue-600 hover:text-blue-700">
          ← Back to Account
        </Link>
      </div>

      <div className="space-y-4" data-testid="orders-list">
        {mockOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white border border-gray-200 rounded-xl p-6"
            data-testid={`order-${order.id}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-mono font-medium text-gray-900">{order.id}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(order.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Shipped"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                  data-testid={`status-${order.id}`}
                >
                  {order.status}
                </span>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{order.items} item{order.items !== 1 ? "s" : ""}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
