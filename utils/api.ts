// const API_BASE = "http://localhost:4500";
const DEFAULT_API_BASE = "https://xboost-ai-backend.onrender.com";

function resolveApiBase() {
  const candidates = [
    process.env.NEXT_PUBLIC_API_BASE,
    process.env.API_BASE,
    DEFAULT_API_BASE,
  ];

  for (const value of candidates) {
    if (typeof value !== "string") continue;
    const normalized = value.trim();
    if (!normalized || normalized === "undefined" || normalized === "null") continue;
    return normalized.replace(/\/+$/, "");
  }

  return DEFAULT_API_BASE;
}

const API_BASE = resolveApiBase();
const AUTH_TOKEN_KEY = "xboost_auth_token";
const ADMIN_PASSWORD_KEY = "xboost_admin_password";

function withBase(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalizedPath}`;
}

function getAuthToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

function setAuthToken(token?: string | null) {
  if (typeof window === "undefined") return;
  if (!token) {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
    return;
  }
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

function getAdminPassword() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(ADMIN_PASSWORD_KEY) || "";
}

function setAdminPassword(password: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ADMIN_PASSWORD_KEY, password);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const token = getAuthToken();
  const res = await fetch(withBase(path), {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "x-timezone": timeZone,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Request failed");
  }

  return res.json();
}

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      const data = await request<{ user: User; token?: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setAuthToken(data.token ?? null);
      return { user: data.user };
    },
    register: async (email: string, password: string, username?: string) => {
      const data = await request<{ user: User; token?: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, username }),
      });
      setAuthToken(data.token ?? null);
      return { user: data.user };
    },
    profile: () => request<User>("/auth/profile"),
    updateGoal: (dailyGoal: number) =>
      request<User>("/auth/goal", {
        method: "PATCH",
        body: JSON.stringify({ dailyGoal }),
      }),
    saveApiKey: (openaiKey: string) =>
      request<{ success: boolean; hasApiKey: boolean; providers?: { provider: string; masked: string }[] }>("/auth/api-key", {
        method: "POST",
        body: JSON.stringify({ openaiKey }),
      }),
    saveProviderApiKey: (provider: string, apiKey: string) =>
      request<{ success: boolean; hasApiKey: boolean; providers?: { provider: string; masked: string }[] }>("/auth/api-key", {
        method: "POST",
        body: JSON.stringify({ provider, apiKey }),
      }),
    removeApiKey: () =>
      request<{ success: boolean; hasApiKey: boolean }>("/auth/api-key", {
        method: "DELETE",
      }),
    removeProviderApiKey: (provider: string) =>
      request<{ success: boolean; hasApiKey: boolean }>("/auth/api-key", {
        method: "DELETE",
        body: JSON.stringify({ provider }),
      }),
    logout: async () => {
      const data = await request<{ success: boolean }>("/auth/logout", { method: "POST" });
      setAuthToken(null);
      return data;
    },
  },

  ai: {
    reply: (
      tweetText: string,
      tone: string,
      opts?: { tweetId?: string; wordCount?: number; templateId?: string; customPrompt?: string },
    ) =>
      request<{ reply: string; tone: string }>("/ai/reply", {
        method: "POST",
        body: JSON.stringify({ tweetText, tone, ...opts }),
      }),
    analyze: (tweetText: string) =>
      request<AnalysisResult>("/ai/analyze", {
        method: "POST",
        body: JSON.stringify({ tweetText }),
      }),
    create: (
      topic: string,
      tone: string,
      opts?: { wordCount?: number; templateId?: string; customPrompt?: string },
    ) =>
      request<{ tweet: string }>("/ai/create", {
        method: "POST",
        body: JSON.stringify({ topic, tone, ...opts }),
      }),
    rewrite: (
      draftText: string,
      tone: string,
      opts?: { wordCount?: number; templateId?: string; customPrompt?: string },
    ) =>
      request<{ rewrite: string }>("/ai/rewrite", {
        method: "POST",
        body: JSON.stringify({ draftText, tone, ...opts }),
      }),
    markPosted: () =>
      request<{ success: boolean }>("/ai/mark-posted", { method: "POST" }),
    templates: () =>
      request<Record<string, { label: string; emoji: string; instruction: string }>>("/ai/templates"),
    templateCatalog: () =>
      request<TweetTemplate[]>("/ai/templates/catalog"),
    tones: () => request<Record<string, string>>("/ai/tones"),
    viralHookIntel: (niche: string, samplePosts: string[]) =>
      request<any>("/ai/viral-hook-intel", {
        method: "POST",
        body: JSON.stringify({ niche, samplePosts }),
      }),
    preLaunchOptimize: (draft: string, niche: string) =>
      request<any>("/ai/prelaunch-optimize", {
        method: "POST",
        body: JSON.stringify({ draft, niche }),
      }),
    trendRadar: (niche: string) =>
      request<any>("/ai/trend-radar", {
        method: "POST",
        body: JSON.stringify({ niche }),
      }),
    growthStrategist: (niche: string, goals: string) =>
      request<any>("/ai/growth-strategist", {
        method: "POST",
        body: JSON.stringify({ niche, goals }),
      }),
    brandAnalyzer: (profile: string, tweets: string[]) =>
      request<any>("/ai/brand-analyzer", {
        method: "POST",
        body: JSON.stringify({ profile, tweets }),
      }),
    threadPro: (topic: string, objective: string) =>
      request<any>("/ai/thread-pro", {
        method: "POST",
        body: JSON.stringify({ topic, objective }),
      }),
    leadMagnet: (content: string, audience: string) =>
      request<any>("/ai/lead-magnet", {
        method: "POST",
        body: JSON.stringify({ content, audience }),
      }),
    audiencePsychology: (niche: string, audience: string) =>
      request<any>("/ai/audience-psychology", {
        method: "POST",
        body: JSON.stringify({ niche, audience }),
      }),
    repurpose: (source: string) =>
      request<any>("/ai/repurpose", {
        method: "POST",
        body: JSON.stringify({ source }),
      }),
    monetizationToolkit: (niche: string, audience: string) =>
      request<any>("/ai/monetization-toolkit", {
        method: "POST",
        body: JSON.stringify({ niche, audience }),
      }),
    viralScore: (draft: string, niche: string) =>
      request<any>("/ai/viral-score", {
        method: "POST",
        body: JSON.stringify({ draft, niche }),
      }),
    bestTimePost: (niche: string) =>
      request<any>("/ai/best-time-post", {
        method: "POST",
        body: JSON.stringify({ niche }),
      }),
    contentPredict: (draft: string, niche: string) =>
      request<any>("/ai/content-predict", {
        method: "POST",
        body: JSON.stringify({ draft, niche }),
      }),
  },

  analytics: {
    dashboard: () => request<DashboardData>("/analytics/dashboard"),
    weekly: () => request<WeeklyReport>("/analytics/weekly"),
    activity: (period: "day" | "week" | "month") =>
      request<ActivityData>("/analytics/activity?period=" + period),
  },

  streak: {
    get: () => request<StreakData>("/streak"),
    check: () => request<StreakData>("/streak/check", { method: "POST" }),
  },

  billing: {
    plans: () => request<Plan[]>("/billing/plans"),
    roadmap: () => request<RoadmapItem[]>("/billing/roadmap"),
    features: () => request<FeatureCatalogItem[]>("/billing/features"),
    subscription: () => request<BillingSubscriptionResponse>("/billing/subscription"),
    payments: () => request<Payment[]>("/billing/payments"),
    checkout: (
      planId: "starter" | "pro",
      opts?: { successUrl?: string; cancelUrl?: string },
    ) =>
      request<{ checkoutId: string | null; checkoutUrl: string | null }>(
        "/billing/checkout",
        {
          method: "POST",
          body: JSON.stringify({ planId, ...opts }),
        },
      ),
    syncCheckout: (checkoutId: string) =>
      request<{
        success: boolean;
        status: string;
        billing: BillingSubscriptionResponse;
      }>("/billing/sync-checkout", {
        method: "POST",
        body: JSON.stringify({ checkoutId }),
      }),
    portal: () => request<{ url: string | null }>("/billing/portal", { method: "POST" }),
    cancel: () =>
      request<{ success: boolean; subscription: BillingSubscription }>(
        "/billing/cancel",
        { method: "POST" },
      ),
  },

  admin: {
    setPassword: (password: string) => setAdminPassword(password),
    templates: () =>
      request<TweetTemplate[]>("/admin/templates", {
        headers: { "x-admin-password": getAdminPassword() },
      }),
    saveTemplate: (payload: Partial<TweetTemplate> & { slug: string; label: string; instruction: string }) =>
      request<TweetTemplate>("/admin/templates", {
        method: "POST",
        headers: { "x-admin-password": getAdminPassword() },
        body: JSON.stringify(payload),
      }),
    removeTemplate: (slug: string) =>
      request<{ success: boolean }>(`/admin/templates/${slug}`, {
        method: "DELETE",
        headers: { "x-admin-password": getAdminPassword() },
      }),
    prompts: () =>
      request<PromptConfig[]>("/admin/prompts", {
        headers: { "x-admin-password": getAdminPassword() },
      }),
    savePrompt: (key: string, value: string, description?: string) =>
      request<PromptConfig>(`/admin/prompts/${key}`, {
        method: "PUT",
        headers: { "x-admin-password": getAdminPassword() },
        body: JSON.stringify({ value, description }),
      }),
    modules: () =>
      request<ModuleConfig[]>("/admin/modules", {
        headers: { "x-admin-password": getAdminPassword() },
      }),
    saveModule: (featureId: string, payload: Partial<ModuleConfig>) =>
      request<ModuleConfig>(`/admin/modules/${featureId}`, {
        method: "PUT",
        headers: { "x-admin-password": getAdminPassword() },
        body: JSON.stringify(payload),
      }),
    roadmap: () =>
      request<RoadmapItem[]>("/admin/roadmap", {
        headers: { "x-admin-password": getAdminPassword() },
      }),
    saveRoadmap: (payload: {
      key: string;
      name: string;
      description: string;
      eta?: string;
      status?: "upcoming" | "active";
      isActive?: boolean;
      sortOrder?: number;
    }) =>
      request<RoadmapItem>("/admin/roadmap", {
        method: "POST",
        headers: { "x-admin-password": getAdminPassword() },
        body: JSON.stringify(payload),
      }),
    removeRoadmap: (key: string) =>
      request<{ success: boolean }>(`/admin/roadmap/${key}`, {
        method: "DELETE",
        headers: { "x-admin-password": getAdminPassword() },
      }),
  },


};

// ── Types ──────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  username?: string;
  dailyGoal: number;
  createdAt: string;
  hasApiKey?: boolean;
  openaiKey?: string;
  apiKeyProviders?: { provider: string; masked: string }[];
}

export interface AnalysisResult {
  tone: string;
  engagementScore: number;
  viralPotential: string;
  hooks: string[];
  suggestions: string[];
  sentiment: string;
  bestReplyAngle?: string;
  estimatedReadTime?: string;
}

export interface DashboardData {
  user: { dailyGoal: number; username: string };
  today: {
    repliesGenerated: number;
    repliesPosted: number;
    goal: number;
    goalCompleted: boolean;
  };
  streak: { current: number; longest: number };
  totals: { replies: number; aiUsage: number };
  weeklyChart: { date: string; replies: number; impressions: number }[];
  tipOfTheDay: string;
}

export interface WeeklyReport {
  totalReplies: number;
  avgRepliesPerDay: number;
  consistencyScore: number;
  growthRating: string;
  estimatedImpressions: number;
}

export interface StreakData {
  current: number;
  longest: number;
}

export interface ActivityData {
  activity: { label: string; replies: number; aiUses: number; impressions: number }[];
  streakHistory: { date: string; goalCompleted: boolean; repliesPosted: number; estimatedImpressions: number }[];
}

export type PlanId = "free" | "starter" | "pro";

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  currency?: string;
  pricing?: {
    basePrice: number;
    finalPrice: number;
    discountPercent: number;
    discountCode?: string | null;
    discountName?: string | null;
    hasDiscount: boolean;
  };
  limits: {
    dailyReplies: number | null;
    dailyTweets: number | null;
  };
  features: {
    tweets: boolean;
    analytics: boolean;
    viralScorePredictor: boolean;
    bestTimeToPost: boolean;
    contentPerformancePrediction: boolean;
    viralHookIntelligence: boolean;
    preLaunchOptimizer: boolean;
    nicheTrendRadar: boolean;
    growthStrategist: boolean;
    brandAnalyzer: boolean;
    threadWriterPro: boolean;
    leadMagnetGenerator: boolean;
    audiencePsychology: boolean;
    repurposingEngine: boolean;
    monetizationToolkit: boolean;
  };
}

export type FeatureId =
  | "analytics"
  | "viralScorePredictor"
  | "bestTimeToPost"
  | "contentPerformancePrediction"
  | "viralHookIntelligence"
  | "preLaunchOptimizer"
  | "nicheTrendRadar"
  | "growthStrategist"
  | "brandAnalyzer"
  | "threadWriterPro"
  | "leadMagnetGenerator"
  | "audiencePsychology"
  | "repurposingEngine"
  | "monetizationToolkit";

export interface FeatureCatalogItem {
  id: FeatureId;
  name: string;
  description: string;
  availability: "live" | "coming_soon";
  minimumPlan: PlanId;
  enabled: boolean;
}

export interface BillingSubscription {
  planId: PlanId;
  status: "active" | "cancelled" | "past_due" | "trialing" | "on_hold" | "renewed";
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  isPaidActive: boolean;
}

export interface BillingUsage {
  repliesCount: number;
  tweetsCount: number;
  remainingReplies: number | null;
  remainingTweets: number | null;
}

export interface BillingSubscriptionResponse {
  subscription: BillingSubscription;
  plan: Plan;
  features: FeatureCatalogItem[];
  usage: BillingUsage;
}

export interface Payment {
  id: string;
  planId: PlanId;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  dodoPaymentId?: string | null;
  dodoInvoiceId?: string | null;
}

export interface TweetTemplate {
  id: string;
  slug: string;
  label: string;
  emoji: string;
  instruction: string;
  structure?: string | null;
  example?: string | null;
  category: string;
  target: "tweet" | "reply" | "both";
  isActive: boolean;
  sortOrder: number;
}

export interface PromptConfig {
  key: string;
  value: string;
  description?: string | null;
}

export interface ModuleConfig {
  id: string;
  name?: string | null;
  description?: string | null;
  availability?: "live" | "coming_soon" | null;
  minimumPlan?: PlanId | null;
  isVisible: boolean;
  promptHint?: string | null;
  inputHelp?: unknown;
  examples?: unknown;
}

export interface RoadmapItem {
  id: string;
  key: string;
  name: string;
  description: string;
  eta?: string | null;
  status: "upcoming" | "active";
  isActive: boolean;
  sortOrder: number;
}
