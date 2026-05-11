"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newErrors: Record<string, string> = {};

    const email = form.get("email")?.toString().trim() || "";
    const password = form.get("password")?.toString() || "";

    if (!email) newErrors.email = "Email is required";
    else if (!email.includes("@")) newErrors.email = "Please enter a valid email";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setGeneralError("");
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      setGeneralError("Invalid email or password. Please try again.");
      setErrors({});
    } else {
      router.push("/account");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Welcome Back</h1>
      <p className="text-gray-600 text-center mb-8">Sign in to your NovaMart account</p>

      {generalError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm" role="alert" data-testid="login-error">
          {generalError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" data-testid="login-form" noValidate>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? "border-red-500" : "border-gray-300"}`}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1" role="alert">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? "border-red-500" : "border-gray-300"}`}
            aria-invalid={!!errors.password}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1" role="alert">{errors.password}</p>}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center text-sm">
            <input type="checkbox" name="remember" className="mr-2 rounded border-gray-300" />
            <span className="text-gray-600">Remember me</span>
          </label>
          <a href="#" className="text-sm text-blue-600 hover:text-blue-700">Forgot password?</a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="login-submit"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Do not have an account?{" "}
        <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 font-medium">
          Create one
        </Link>
      </p>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm text-gray-600" data-testid="demo-credentials">
        <p className="font-medium text-gray-700 mb-1">Demo Credentials:</p>
        <p>Email: demo@novamart.com</p>
        <p>Password: Demo123!</p>
      </div>
    </div>
  );
}
