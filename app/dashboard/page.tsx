"use client";

import { useEffect, useMemo, useState } from "react";
import { useDashboard } from "./context";
import { api, BillingSubscriptionResponse, RoadmapItem, TweetTemplate } from "@/utils/api";

const CHROME_STORE_URL =
  "https://chromewebstore.google.com/detail/pohpmpfbaenppabefjbgjfdhncnkfpml";

export default function DashboardPage() {
  const { user } = useDashboard();
  const [billing, setBilling] = useState<BillingSubscriptionResponse | null>(null);
  const [templates, setTemplates] = useState<TweetTemplate[]>([]);
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [billingData, templateData] = await Promise.all([
          api.billing.subscription(),
          api.ai.templateCatalog().catch(() => [] as TweetTemplate[]),
        ]);
        const roadmapData = await api.billing.roadmap().catch(() => [] as RoadmapItem[]);
        setBilling(billingData);
        setTemplates(templateData.filter((t) => t.isActive));
        setRoadmap(roadmapData.filter((r) => r.isActive));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const templateList = useMemo(() => templates.slice(0, 6), [templates]);
  const asTweet = (t: TweetTemplate) => {
    const structure = (t.structure || "").replace(/\\n/g, "\n").trim();
    const example = (t.example || "").replace(/\\n/g, "\n").trim();
    const instruction = (t.instruction || "").replace(/\\n/g, "\n").trim();
    return example || structure || instruction;
  };

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

  const liveModules = useMemo(
    () => (billing?.features ?? []).filter((f) => f.availability === "live"),
    [billing],
  );

  const unlockedModules = useMemo(
    () => liveModules.filter((f) => f.enabled),
    [liveModules],
  );
  const roadmapCards = useMemo(() => roadmap.slice(0, 3), [roadmap]);

  return (
    <div className="max-w-6xl mx-auto py-4 space-y-6 text-[#1a0a2e]">
      <section className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/95 via-white to-violet-50/90 p-7 shadow-[0_18px_60px_rgba(92,100,230,0.12)]">
        <div className="absolute -top-24 -right-20 h-64 w-64 rounded-full bg-indigo-200/45 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-violet-200/35 blur-3xl" />

        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-indigo-500">Workspace Overview</p>
          <h1 className="mt-2 text-3xl font-extrabold text-[#1a0a2e] md:text-4xl">
            Welcome back, {user?.username ?? user?.email}
          </h1>

          <p className="mt-3 text-sm text-slate-600">
            Plan: <span className="font-semibold text-indigo-600">{billing?.plan.name ?? "Free"}</span> · Daily goal:{" "}
            <span className="font-semibold text-slate-700">{user?.dailyGoal}</span>
          </p>
          <p className="mt-1 text-sm text-slate-600">{usageText}</p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(99,102,241,0.35)] transition hover:opacity-90"
            >
              Add to Chrome
            </a>
            <a
              href="/dashboard/billing"
              className="rounded-xl border border-indigo-200 bg-white/80 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
            >
              Manage Plan
            </a>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50/60 p-5 shadow-[0_10px_34px_rgba(92,100,230,0.08)]">
          <p className="text-[11px] uppercase tracking-[0.1em] text-indigo-400">Today</p>
          <p className="mt-2 text-3xl font-semibold text-[#1a0a2e]">{billing?.usage.repliesCount ?? 0}</p>
          <p className="mt-1 text-sm text-slate-600">Replies generated</p>
        </div>

        <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-white to-violet-50/60 p-5 shadow-[0_10px_34px_rgba(124,58,237,0.08)]">
          <p className="text-[11px] uppercase tracking-[0.1em] text-violet-400">Composer</p>
          <p className="mt-2 text-3xl font-semibold text-[#1a0a2e]">{billing?.usage.tweetsCount ?? 0}</p>
          <p className="mt-1 text-sm text-slate-600">Tweets generated today</p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/55 p-5 shadow-[0_10px_34px_rgba(59,130,246,0.08)]">
          <p className="text-[11px] uppercase tracking-[0.1em] text-blue-400">Plan Status</p>
          <p className="mt-2 text-2xl font-bold capitalize text-[#1a0a2e]">{billing?.subscription.status ?? "active"}</p>
          <p className="mt-1 text-sm text-slate-600">Billing health and access state</p>
        </div>
      </section>

      <section className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50/40 p-6 shadow-[0_12px_38px_rgba(92,100,230,0.07)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#1a0a2e]">Template Library</h2>
          <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-500">
            {templateList.length} templates
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="h-24 rounded-xl shimmer" />
            <div className="h-24 rounded-xl shimmer" />
            <div className="h-24 rounded-xl shimmer" />
            <div className="h-24 rounded-xl shimmer" />
          </div>
        ) : templateList.length === 0 ? (
          <p className="text-sm text-slate-500">No templates available yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {templateList.map((t) => (
              <article key={t.slug} className="rounded-2xl border border-indigo-100 bg-white p-4 shadow-[0_8px_20px_rgba(92,100,230,0.06)]">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-xs font-bold flex items-center justify-center">
                      XB
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#111111]">XBoost AI</p>
                      <p className="text-[11px] text-slate-400">@xboostai · {t.emoji} {t.label}</p>
                    </div>
                  </div>
                  <span className="text-[10px] rounded-full border border-indigo-100 bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-600">
                    {t.target}
                  </span>
                </div>
                <pre className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 font-sans">
                  {asTweet(t)}
                </pre>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50/40 p-6 shadow-[0_12px_38px_rgba(92,100,230,0.07)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#111111]">
            XBoost <span className="text-violet-600">AI</span> Modules
          </h2>
          <a href="/dashboard/features" className="text-xs font-semibold text-violet-600 hover:text-violet-700">
            View all
          </a>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          {unlockedModules.length} of {liveModules.length} live modules unlocked on your plan.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {liveModules.slice(0, 6).map((feature) => (
            <div key={feature.id} className="rounded-xl border border-indigo-100 bg-white/90 px-4 py-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#111111]">{feature.name}</p>
                <p className="text-xs text-slate-500 mt-1">{feature.description}</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${feature.enabled ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                {feature.enabled ? "Live" : "Locked"}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-violet-100 bg-gradient-to-br from-white to-violet-50/40 p-6 shadow-[0_12px_38px_rgba(124,58,237,0.07)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#1a0a2e]">Upcoming</h2>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-violet-500">Roadmap</span>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {roadmapCards.map((item) => (
            <div key={item.key} className="rounded-xl border border-indigo-100 bg-white/90 p-4 shadow-[0_8px_20px_rgba(92,100,230,0.04)]">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-500">{item.eta || "Soon"}</p>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${item.status === "active" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-violet-50 text-violet-600 border-violet-200"}`}>
                  {item.status === "active" ? "Live" : "Upcoming"}
                </span>
              </div>
              <p className="mt-1 text-sm font-semibold text-[#1a0a2e]">{item.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{item.description}</p>
            </div>
          ))}
          {!roadmapCards.length && (
            <div className="rounded-xl border border-indigo-100 bg-white/90 p-4 text-xs text-slate-500">
              No upcoming roadmap items configured yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
