"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

export default function AccountPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [displayNameEdit, setDisplayNameEdit] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          <div className="relative w-20 h-20 mx-auto mb-4 group">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" data-testid="avatar-image" />
              ) : (
                <span className="text-2xl font-bold text-blue-600">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Upload avatar"
              data-testid="avatar-upload-btn"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              data-testid="avatar-file-input"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  setAvatarUrl(url);
                }
              }}
            />
          </div>
          {editingName ? (
            <div className="text-center mb-1" data-testid="name-edit-form">
              <input
                type="text"
                value={displayNameEdit}
                onChange={(e) => setDisplayNameEdit(e.target.value)}
                onBlur={() => setEditingName(false)}
                onKeyDown={(e) => { if (e.key === "Enter") setEditingName(false); }}
                className="text-center font-bold text-gray-900 border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
                data-testid="name-edit-input"
              />
            </div>
          ) : (
            <h2
              className="text-center font-bold text-gray-900 cursor-pointer hover:text-blue-600"
              data-testid="user-name"
              onDoubleClick={() => { setDisplayNameEdit(displayName); setEditingName(true); }}
              title="Double-click to edit"
            >
              {displayNameEdit || displayName}
            </h2>
          )}
          <p className="text-center text-xs text-gray-400 mb-1">Double-click name to edit</p>
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
