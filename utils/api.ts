// const API_BASE = "http://localhost:4500";
// const API_BASE = "https://xboost-ai-backend.onrender.com"
const API_BASE = process.env.API_BASE as string;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
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
    login: (email: string, password: string) =>
      request<{ user: User }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    register: (email: string, password: string, username?: string) =>
      request<{ user: User }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, username }),
      }),
    profile: () => request<User>("/auth/profile"),
    updateGoal: (dailyGoal: number) =>
      request<User>("/auth/goal", {
        method: "PATCH",
        body: JSON.stringify({ dailyGoal }),
      }),
    saveApiKey: (openaiKey: string) =>
      request<{ success: boolean; hasApiKey: boolean }>("/auth/api-key", {
        method: "POST",
        body: JSON.stringify({ openaiKey }),
      }),
    removeApiKey: () =>
      request<{ success: boolean; hasApiKey: boolean }>("/auth/api-key", {
        method: "DELETE",
      }),
    logout: () =>
      request<{ success: boolean }>("/auth/logout", { method: "POST" }),
  },

  ai: {
    reply: (
      tweetText: string,
      tone: string,
      opts?: { tweetId?: string; wordCount?: number; templateId?: string },
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
      opts?: { wordCount?: number; templateId?: string },
    ) =>
      request<{ tweet: string }>("/ai/create", {
        method: "POST",
        body: JSON.stringify({ topic, tone, ...opts }),
      }),
    rewrite: (
      draftText: string,
      tone: string,
      opts?: { wordCount?: number; templateId?: string },
    ) =>
      request<{ rewrite: string }>("/ai/rewrite", {
        method: "POST",
        body: JSON.stringify({ draftText, tone, ...opts }),
      }),
    markPosted: () =>
      request<{ success: boolean }>("/ai/mark-posted", { method: "POST" }),
    templates: () =>
      request<Record<string, { label: string; emoji: string; instruction: string }>>("/ai/templates"),
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
    subscription: () => request<BillingSubscriptionResponse>("/billing/subscription"),
    payments: () => request<Payment[]>("/billing/payments"),
    checkout: (planId: "starter" | "pro") =>
      request<{ checkoutId: string | null; checkoutUrl: string | null }>(
        "/billing/checkout",
        {
          method: "POST",
          body: JSON.stringify({ planId }),
        },
      ),
    portal: () => request<{ url: string | null }>("/billing/portal", { method: "POST" }),
    cancel: () =>
      request<{ success: boolean; subscription: BillingSubscription }>(
        "/billing/cancel",
        { method: "POST" },
      ),
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
  limits: {
    dailyReplies: number | null;
    dailyTweets: number | null;
  };
  features: {
    tweets: boolean;
    analytics: boolean;
  };
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


