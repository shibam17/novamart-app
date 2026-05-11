"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center" data-testid="not-logged-in">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">My Account</h1>
        <p className="text-gray-600 mb-6">Please sign in to view your account.</p>
        <Link href="/auth/login" className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Sign In
        </Link>
      </div>
    );
  }

  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white border border-gray-200 rounded-xl p-6" data-testid="profile-card">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-blue-600">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="text-center font-bold text-gray-900" data-testid="user-name">{displayName}</h2>
          <p className="text-center text-sm text-gray-500" data-testid="user-email">{user.email}</p>
          <button
            onClick={handleLogout}
            className="w-full mt-6 border border-red-300 text-red-600 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
            data-testid="logout-btn"
          >
            Sign Out
          </button>
        </div>

        <div className="md:col-span-2 space-y-4">
          <Link href="/account/orders" className="block bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-200 hover:bg-blue-50/50 transition-colors" data-testid="orders-link">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Order History</h3>
                <p className="text-sm text-gray-500 mt-1">View past orders and track shipments</p>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          <div className="bg-white border border-gray-200 rounded-xl p-6" data-testid="addresses-section">
            <h3 className="font-medium text-gray-900 mb-1">Saved Addresses</h3>
            <p className="text-sm text-gray-500">Manage your shipping and billing addresses</p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">No saved addresses yet.</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6" data-testid="preferences-section">
            <h3 className="font-medium text-gray-900 mb-1">Preferences</h3>
            <p className="text-sm text-gray-500 mb-4">Manage your notification and display preferences</p>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Email notifications</span>
                <input type="checkbox" defaultChecked className="rounded border-gray-300" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Order updates</span>
                <input type="checkbox" defaultChecked className="rounded border-gray-300" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Promotional emails</span>
                <input type="checkbox" className="rounded border-gray-300" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
