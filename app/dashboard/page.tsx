"use client";

import { useEffect, useMemo, useState } from "react";
import { useDashboard } from "./context";
import { api, BillingSubscriptionResponse, DashboardData } from "@/utils/api";

type TemplateMap = Record<
  string,
  { label: string; emoji: string; instruction: string }
>;

const UPCOMING = [
  {
    title: "Team Workspaces",
    eta: "Q2 2026",
    desc: "Shared brand voice, team prompts, and role-based access for multi-creator teams.",
  },
  {
    title: "Auto A/B Variants",
    eta: "Q2 2026",
    desc: "Generate multiple post variants with hook scoring before publishing.",
  },
  {
    title: "Competitor Pulse",
    eta: "Q3 2026",
    desc: "Track niche leaders and uncover weekly content gaps you can exploit.",
  },
];

export default function DashboardPage() {
  const { user } = useDashboard();
  const [billing, setBilling] = useState<BillingSubscriptionResponse | null>(null);
  const [templates, setTemplates] = useState<TemplateMap>({});
  const [analytics, setAnalytics] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [billingData, templateData] = await Promise.all([
          api.billing.subscription(),
          api.ai.templates().catch(() => ({})),
        ]);
        setBilling(billingData);
        setTemplates(templateData);

        if (billingData.plan.features.analytics) {
          const dash = await api.analytics.dashboard().catch(() => null);
          setAnalytics(dash);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const templateList = useMemo(() => Object.entries(templates), [templates]);
  const usageText = useMemo(() => {
    if (!billing) return "Loading usage…";
    const replies =
      billing.usage.remainingReplies == null
        ? `${billing.usage.repliesCount} / Unlimited`
        : `${billing.usage.repliesCount} / ${billing.plan.limits.dailyReplies}`;
    const tweets =
      billing.usage.remainingTweets == null
        ? `${billing.usage.tweetsCount} / Unlimited`
        : `${billing.usage.tweetsCount} / ${billing.plan.limits.dailyTweets}`;
    return `Replies: ${replies} · Tweets: ${tweets}`;
  }, [billing]);

  return (
    <div className="max-w-6xl mx-auto py-4 space-y-6">
      <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.username ?? user?.email}
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Plan: <span className="font-semibold text-indigo-600">{billing?.plan.name ?? "Free"}</span> · Daily goal: {user?.dailyGoal}
        </p>
        <p className="mt-1 text-sm text-gray-500">{usageText}</p>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="text-xs uppercase tracking-wide text-gray-400 font-semibold mb-2">Today</div>
          <div className="text-2xl font-bold text-gray-800">
            {billing?.usage.repliesCount ?? 0}
          </div>
          <div className="text-sm text-gray-500">Replies generated</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="text-xs uppercase tracking-wide text-gray-400 font-semibold mb-2">Composer</div>
          <div className="text-2xl font-bold text-gray-800">
            {billing?.usage.tweetsCount ?? 0}
          </div>
          <div className="text-sm text-gray-500">Tweets generated today</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="text-xs uppercase tracking-wide text-gray-400 font-semibold mb-2">Streak</div>
          <div className="text-2xl font-bold text-gray-800">
            {analytics?.streak.current ?? 0}
          </div>
          <div className="text-sm text-gray-500">Current posting streak</div>
        </div>
      </section>

      <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Template Library</h2>
          <span className="text-xs text-gray-400">{templateList.length} templates</span>
        </div>
        {loading ? (
          <p className="text-sm text-gray-400">Loading templates…</p>
        ) : templateList.length === 0 ? (
          <p className="text-sm text-gray-400">No templates available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {templateList.map(([id, t]) => (
              <div key={id} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                <div className="text-sm font-semibold text-gray-700 mb-1">
                  {t.emoji} {t.label}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{t.instruction}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Upcoming</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {UPCOMING.map((item) => (
            <div key={item.title} className="border border-indigo-100 bg-indigo-50 rounded-xl p-4">
              <div className="text-[11px] uppercase tracking-wide text-indigo-500 font-semibold mb-1">
                {item.eta}
              </div>
              <div className="text-sm font-semibold text-gray-800">{item.title}</div>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
