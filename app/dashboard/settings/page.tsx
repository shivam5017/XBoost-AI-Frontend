"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, User } from "@/utils/api";
import PageLoader from "../../loading";

const GOAL_OPTIONS = [5, 10, 20];

export default function DashboardSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedGoal, setSelectedGoal] = useState(5);
  const [goalSaved, setGoalSaved] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [keySaving, setKeySaving] = useState(false);
  const [keySaved, setKeySaved] = useState(false);
  const [keyError, setKeyError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await api.auth.profile();
        setUser(profile);
        setSelectedGoal(profile.dailyGoal || 5);
      } catch {
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleSaveGoal = async () => {
    try {
      await api.auth.updateGoal(selectedGoal);
      setUser((prev) => (prev ? { ...prev, dailyGoal: selectedGoal } : prev));
      setGoalSaved(true);
      setTimeout(() => setGoalSaved(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) return;
    setKeySaving(true);
    setKeyError("");
    try {
      const result = await api.auth.saveApiKey(apiKey.trim());
      if (result.success) {
        setUser((prev) => (prev ? { ...prev, hasApiKey: true } : prev));
        setApiKey("");
        setKeySaved(true);
        setTimeout(() => setKeySaved(false), 2000);
      }
    } catch (err: any) {
      setKeyError(err.message || "Failed to save key");
    } finally {
      setKeySaving(false);
    }
  };

  const handleRemoveApiKey = async () => {
    try {
      await api.auth.removeApiKey();
      setUser((prev) => (prev ? { ...prev, hasApiKey: false } : prev));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <PageLoader />;
  if (!user) return null;

  return (
    <div className="min-h-full p-5 bg-gradient-to-br from-violet-50 via-white to-indigo-50 flex flex-col gap-4">

      {/* Header */}
      <div>
        <h1 className="text-base font-bold text-gray-800">Settings</h1>
        <p className="text-xs text-gray-400 mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Account Card */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Account</div>

        {/* Avatar + Name */}
        <div className="flex items-center gap-3 mb-5 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {(user.username ?? user.email ?? "U")[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-800 truncate">
              {user.username ? `@${user.username}` : user.email}
            </div>
            <div className="text-xs text-gray-400 truncate">{user.email}</div>
          </div>
        </div>

        <div className="space-y-3">
          {user.username && (
            <div className="flex justify-between items-center text-sm py-2 border-b border-gray-50">
              <span className="text-gray-400">Username</span>
              <span className="font-medium text-gray-700">@{user.username}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-sm py-2 border-b border-gray-50">
            <span className="text-gray-400">Email</span>
            <span className="font-medium text-gray-700">{user.email}</span>
          </div>
          <div className="flex justify-between items-center text-sm py-2">
            <span className="text-gray-400">Member since</span>
            <span className="font-medium text-gray-700">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en", { month: "short", year: "numeric" })
                : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* API Key Card */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">OpenAI API Key</div>

        {user.hasApiKey ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-sm text-emerald-600 font-medium">API key connected</span>
              </div>
              {user.openaiKey && (
                <span className="text-xs font-mono text-gray-400 truncate max-w-[120px]">
                  {user.openaiKey.slice(0, 8)}...
                </span>
              )}
            </div>
            <button
              onClick={handleRemoveApiKey}
              className="w-full py-2.5 rounded-xl text-sm font-medium text-red-500 border border-red-100 bg-red-50 hover:bg-red-100 transition-all duration-200"
            >
              Remove Key
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-gray-50 transition"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="px-3 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-sm transition"
              >
                {showKey ? "🙈" : "👁"}
              </button>
            </div>

            {keyError && (
              <div className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {keyError}
              </div>
            )}

            <button
              onClick={handleSaveApiKey}
              disabled={keySaving || !apiKey.trim()}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                keySaved
                  ? "bg-emerald-500 text-white"
                  : "bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              {keySaved ? "✓ Key Saved!" : keySaving ? "Saving..." : "Save API Key"}
            </button>
          </div>
        )}
      </div>

      {/* Daily Goal Card */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Daily Reply Goal</div>
        <p className="text-xs text-gray-400 mb-4">How many replies do you want to post each day?</p>

        <div className="flex gap-2 mb-4">
          {GOAL_OPTIONS.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGoal(g)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 border ${
                selectedGoal === g
                  ? "border-indigo-400 bg-indigo-50 text-indigo-600 shadow-sm"
                  : "border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              {g}
              <div className="text-xs font-normal mt-0.5 opacity-60">
                {g === 5 ? "Easy" : g === 10 ? "Builder" : "Machine"}
              </div>
            </button>
          ))}
        </div>

        {/* Current goal indicator */}
        <div className="text-xs text-gray-400 text-center mb-3">
          Current goal: <strong className="text-indigo-500">{user.dailyGoal} replies/day</strong>
        </div>

        <button
          onClick={handleSaveGoal}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            goalSaved
              ? "bg-emerald-500 text-white"
              : "bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:opacity-90"
          }`}
        >
          {goalSaved ? "✓ Saved!" : "Save Goal"}
        </button>
      </div>
    </div>
  );
}