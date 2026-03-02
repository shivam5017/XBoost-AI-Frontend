"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, User } from "@/utils/api";
import PageLoader from "../../loading";
import { toast } from "sonner";

const GOAL_OPTIONS = [5, 10, 20];
const APP_VERSION = "v1.1.1";
const PROVIDERS = [
  { id: "openai", label: "OpenAI / ChatGPT" },
  { id: "google", label: "Google Gemini" },
  { id: "xai", label: "xAI (Grok)" },
  { id: "mistral", label: "Mistral" },
];

const PROVIDER_LINKS: Record<string, { label: string; href: string }> = {
  openai: { label: "platform.openai.com", href: "https://platform.openai.com/api-keys" },
  chatgpt: { label: "platform.openai.com", href: "https://platform.openai.com/api-keys" },
  google: { label: "aistudio.google.com", href: "https://aistudio.google.com/app/apikey" },
  xai: { label: "console.x.ai", href: "https://console.x.ai/" },
  mistral: { label: "console.mistral.ai", href: "https://console.mistral.ai/api-keys/" },
};

export default function DashboardSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedGoal, setSelectedGoal] = useState(5);
  const [goalSaved, setGoalSaved] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [provider, setProvider] = useState("openai");
  const [showKey, setShowKey] = useState(false);
  const [keySaving, setKeySaving] = useState(false);
  const [keySaved, setKeySaved] = useState(false);
  const [keyError, setKeyError] = useState("");
  const providerLink = PROVIDER_LINKS[provider] ?? PROVIDER_LINKS.openai;

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
      toast.success("Daily goal updated");
      setTimeout(() => setGoalSaved(false), 2000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update daily goal");
    }
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) return;
    if (user?.apiKeyProviders?.length) {
      const message = "You already have an API key added. Remove it before adding another.";
      setKeyError(message);
      toast.error(message);
      return;
    }
    setKeySaving(true);
    setKeyError("");
    try {
      const result = await api.auth.saveProviderApiKey(provider, apiKey.trim());
      if (result.success) {
        setUser((prev) =>
          prev
            ? { ...prev, hasApiKey: true, apiKeyProviders: result.providers }
            : prev,
        );
        setApiKey("");
        setKeySaved(true);
        toast.success(`${provider.toUpperCase()} key saved securely`);
        setTimeout(() => setKeySaved(false), 2000);
      }
    } catch (err: any) {
      const message = err.message || "Failed to save key";
      setKeyError(message);
      toast.error(message);
    } finally {
      setKeySaving(false);
    }
  };

  const handleRemoveApiKey = async (selectedProvider?: string) => {
    try {
      if (selectedProvider) {
        await api.auth.removeProviderApiKey(selectedProvider);
      } else {
        await api.auth.removeApiKey();
      }
      const profile = await api.auth.profile();
      setUser(profile);
      toast.success(selectedProvider ? "Provider key removed" : "All provider keys removed");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove key");
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
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">AI Provider API Keys</div>

        <div className="space-y-3">
          {user.hasApiKey && user.apiKeyProviders?.length ? (
            <div className="space-y-2">
              {user.apiKeyProviders.map((p) => (
                <div key={p.provider} className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5 gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span className="text-sm text-emerald-600 font-medium capitalize">{p.provider}</span>
                    <span className="text-xs font-mono text-gray-400 truncate">{p.masked}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveApiKey(p.provider)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : null}

          <div className="flex gap-2">
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50"
              >
                {PROVIDERS.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={`${provider.toUpperCase()} API key...`}
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

          <p className="text-xs text-gray-400">
            Get your key from{" "}
            <a href={providerLink.href} target="_blank" rel="noreferrer" className="text-indigo-500 hover:text-indigo-600 underline">
              {providerLink.label}
            </a>
            .
          </p>

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
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Legal</div>
        <div className="flex gap-4 text-sm">
          <a href="/privacy-policy" className="text-indigo-500 hover:text-indigo-600">Privacy Policy</a>
          <a href="/terms-of-service" className="text-indigo-500 hover:text-indigo-600">Terms</a>
          <a href="/cookie-policy" className="text-indigo-500 hover:text-indigo-600">Cookie Policy</a>
        </div>
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

      <p className="text-center text-[11px] text-gray-400">Version {APP_VERSION}</p>
    </div>
  );
}
