"use client";

import { useEffect, useMemo, useState } from "react";
import { api, FeatureCatalogItem, FeatureId } from "@/utils/api";
import { toast } from "sonner";

type PlaygroundState = {
  niche: string;
  audience: string;
  draft: string;
  profile: string;
  topic: string;
  goals: string;
  source: string;
  samplePosts: string;
  tweets: string;
};

const MODULE_ORDER: FeatureId[] = [
  "viralScorePredictor",
  "bestTimeToPost",
  "contentPerformancePrediction",
  "viralHookIntelligence",
  "preLaunchOptimizer",
  "nicheTrendRadar",
  "growthStrategist",
  "brandAnalyzer",
  "threadWriterPro",
  "leadMagnetGenerator",
  "audiencePsychology",
  "repurposingEngine",
  "monetizationToolkit",
];

const MODULE_LABELS: Record<FeatureId, string> = {
  analytics: "Analytics Dashboard",
  viralScorePredictor: "Viral Score Predictor",
  bestTimeToPost: "Best Time to Post",
  contentPerformancePrediction: "Content Performance Prediction",
  viralHookIntelligence: "Viral Hook Intelligence",
  preLaunchOptimizer: "Pre-Launch Optimizer",
  nicheTrendRadar: "Niche Trend Radar",
  growthStrategist: "AI Growth Strategist",
  brandAnalyzer: "Personal Brand Analyzer",
  threadWriterPro: "Thread Writer Pro+",
  leadMagnetGenerator: "Lead Magnet Generator",
  audiencePsychology: "Audience Psychology",
  repurposingEngine: "Repurposing Engine",
  monetizationToolkit: "Monetization Toolkit",
};

const UPCOMING = [
  {
    name: "X Intent Radar",
    eta: "Q3 2026",
    description: "Intent graph to identify high-buying conversations in your niche in real time.",
  },
  {
    name: "Creator Copilot Agent",
    eta: "Q3 2026",
    description: "Goal-driven AI operator that proposes, drafts, and schedules your weekly growth stack.",
  },
  {
    name: "Deal Flow Signals",
    eta: "Q4 2026",
    description: "Detect partnership and sponsor opportunities from your engagement trajectory.",
  },
];

function planChip(plan: "free" | "starter" | "pro") {
  if (plan === "starter") return "Starter";
  if (plan === "pro") return "Pro";
  return "Free";
}

function splitLines(value: string): string[] {
  return value
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

function pretty(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function FeatureCard({ feature }: { feature: FeatureCatalogItem }) {
  const statusClass = feature.enabled
    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
    : "bg-slate-100 text-slate-500 border-slate-200";

  return (
    <article className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-[0_8px_28px_rgba(92,100,230,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-bold text-[#131313]">{feature.name}</h3>
        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusClass}`}>
          {feature.enabled ? "Live" : "Upgrade"}
        </span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-slate-600">{feature.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="rounded-full bg-violet-50 px-2 py-1 text-[10px] font-semibold text-violet-600">
          {planChip(feature.minimumPlan)}
        </span>
        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
          {feature.availability === "live" ? "Production" : "Coming soon"}
        </span>
      </div>
    </article>
  );
}

export default function FeaturesPage() {
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [features, setFeatures] = useState<FeatureCatalogItem[]>([]);
  const [selected, setSelected] = useState<FeatureId>("viralHookIntelligence");
  const [output, setOutput] = useState<string>("");
  const [state, setState] = useState<PlaygroundState>({
    niche: "AI creator growth",
    audience: "early-stage creators",
    draft: "Most creators are posting daily but still not getting qualified leads.",
    profile: "@creator building AI systems for audience growth and monetization.",
    topic: "How to grow with AI workflows",
    goals: "Increase reach, leads, and conversions over 30 days",
    source: "5 lessons from building content systems that scale revenue.",
    samplePosts: "Most creators optimize views, not conversion.\nConsistency without positioning is invisible.\nNiche authority compounds faster than viral randomness.",
    tweets: "I tested 3 posting frameworks this week and one clearly outperformed.\nIf your content does not create a decision, it gets ignored.\nYou do not need more ideas. You need repeatable structures.",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const list = await api.billing.features();
        setFeatures(list);
      } catch (error: any) {
        toast.error(error?.message || "Failed to load feature access");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const live = useMemo(() => features.filter((f) => f.availability === "live"), [features]);
  const enabledCount = useMemo(() => live.filter((f) => f.enabled).length, [live]);
  const selectedFeature = useMemo(() => features.find((f) => f.id === selected), [features, selected]);

  const runSelected = async () => {
    setRunning(true);
    setOutput("");
    try {
      let result: unknown;
      if (selected === "viralHookIntelligence") {
        result = await api.ai.viralHookIntel(state.niche, splitLines(state.samplePosts));
      } else if (selected === "viralScorePredictor") {
        result = await api.ai.viralScore(state.draft, state.niche);
      } else if (selected === "bestTimeToPost") {
        result = await api.ai.bestTimePost(state.niche);
      } else if (selected === "contentPerformancePrediction") {
        result = await api.ai.contentPredict(state.draft, state.niche);
      } else if (selected === "preLaunchOptimizer") {
        result = await api.ai.preLaunchOptimize(state.draft, state.niche);
      } else if (selected === "nicheTrendRadar") {
        result = await api.ai.trendRadar(state.niche);
      } else if (selected === "growthStrategist") {
        result = await api.ai.growthStrategist(state.niche, state.goals);
      } else if (selected === "brandAnalyzer") {
        result = await api.ai.brandAnalyzer(state.profile, splitLines(state.tweets));
      } else if (selected === "threadWriterPro") {
        result = await api.ai.threadPro(state.topic, state.goals);
      } else if (selected === "leadMagnetGenerator") {
        result = await api.ai.leadMagnet(state.source, state.audience);
      } else if (selected === "audiencePsychology") {
        result = await api.ai.audiencePsychology(state.niche, state.audience);
      } else if (selected === "repurposingEngine") {
        result = await api.ai.repurpose(state.source);
      } else if (selected === "monetizationToolkit") {
        result = await api.ai.monetizationToolkit(state.niche, state.audience);
      } else {
        result = { info: "Select a module" };
      }

      setOutput(pretty(result));
      toast.success("Module executed");
    } catch (error: any) {
      toast.error(error?.message || "Module execution failed");
      setOutput(pretty({ error: error?.message || "Failed" }));
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="min-h-full p-5 bg-gradient-to-br from-violet-50 via-white to-indigo-50 flex flex-col gap-4">
      <section className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-[0_12px_36px_rgba(92,100,230,0.07)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-violet-500">Product Modules</p>
        <h1 className="mt-2 text-2xl font-extrabold text-[#111111]">
          XBoost <span className="text-violet-600">AI</span> Feature Access
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {enabledCount} of {live.length} live growth modules are active on your current plan.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {loading ? (
          <>
            <div className="h-40 rounded-2xl shimmer" />
            <div className="h-40 rounded-2xl shimmer" />
            <div className="h-40 rounded-2xl shimmer" />
            <div className="h-40 rounded-2xl shimmer" />
          </>
        ) : (
          live.map((feature) => <FeatureCard key={feature.id} feature={feature} />)
        )}
      </section>

      <section className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-[0_12px_36px_rgba(92,100,230,0.07)]">
        <h2 className="text-xl font-bold text-[#111111]">Module Playground</h2>
        <p className="text-xs text-slate-500 mt-1">Run live modules from dashboard with your plan-based access control.</p>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-3 flex flex-col gap-2">
            {MODULE_ORDER.map((id) => (
              <button
                key={id}
                onClick={() => setSelected(id)}
                className={`text-left rounded-xl px-3 py-2 text-xs font-semibold transition ${selected === id ? "bg-white text-violet-600 border border-violet-200" : "text-slate-600 hover:bg-white/70"}`}
              >
                {MODULE_LABELS[id]}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-indigo-100 p-4 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input value={state.niche} onChange={(e) => setState((s) => ({ ...s, niche: e.target.value }))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Niche" />
              <input value={state.audience} onChange={(e) => setState((s) => ({ ...s, audience: e.target.value }))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Audience" />
              <input value={state.topic} onChange={(e) => setState((s) => ({ ...s, topic: e.target.value }))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Topic" />
              <input value={state.goals} onChange={(e) => setState((s) => ({ ...s, goals: e.target.value }))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Goals / objective" />
            </div>

            <textarea value={state.draft} onChange={(e) => setState((s) => ({ ...s, draft: e.target.value }))} className="mt-3 h-20 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Draft" />
            <textarea value={state.profile} onChange={(e) => setState((s) => ({ ...s, profile: e.target.value }))} className="mt-3 h-16 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Profile text" />
            <textarea value={state.samplePosts} onChange={(e) => setState((s) => ({ ...s, samplePosts: e.target.value }))} className="mt-3 h-20 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Sample posts (one per line)" />
            <textarea value={state.tweets} onChange={(e) => setState((s) => ({ ...s, tweets: e.target.value }))} className="mt-3 h-20 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Past tweets (one per line)" />
            <textarea value={state.source} onChange={(e) => setState((s) => ({ ...s, source: e.target.value }))} className="mt-3 h-20 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Source content" />

            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-slate-500">{selectedFeature?.description || "Select a module"}</p>
              <button
                onClick={runSelected}
                disabled={running}
                className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-2 text-sm font-semibold disabled:opacity-60"
              >
                {running ? "Running..." : "Run Module"}
              </button>
            </div>

            <pre className="mt-4 rounded-xl bg-slate-950 text-slate-100 p-4 text-xs overflow-auto max-h-96">{output || "Output will appear here..."}</pre>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-violet-100 bg-white p-6 shadow-[0_12px_36px_rgba(124,58,237,0.07)]">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#111111]">Coming Soon</h2>
          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-violet-500">Roadmap</span>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          {UPCOMING.map((item) => (
            <div key={item.name} className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-600">{item.eta}</p>
              <p className="mt-1 text-sm font-bold text-[#111111]">{item.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
