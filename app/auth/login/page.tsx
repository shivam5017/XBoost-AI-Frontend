"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      setError(null);

      await api.auth.login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.auth.profile()
      .then(() => router.push("/dashboard"))
      .catch(() => {});
  }, [router]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.06)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute -top-28 -left-24 w-80 h-80 rounded-full bg-purple-200/30 blur-3xl" />
      <div className="absolute -bottom-28 -right-24 w-80 h-80 rounded-full bg-indigo-200/30 blur-3xl" />

      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-100 p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="font-extrabold text-gray-900 text-2xl">
            Login to <span className="text-purple-600">XBoost AI</span>
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Welcome back. Let’s grow today.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing you in..." : "Sign In →"}
          </button>

          {/* Switch */}
          <div className="text-center text-sm text-gray-500 pt-2">
            Don’t have an account?{" "}
            <a
              href="/auth/register"
              className="text-purple-600 font-medium hover:underline"
            >
              Create one
            </a>
          </div>

        </form>
      </div>
    </div>
  );
}
