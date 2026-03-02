"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, FeatureCatalogItem, FeatureId } from "@/utils/api";
import { toast } from "sonner";
import { FEATURE_UI_META } from "../feature-meta";

type FormState = {
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

type ExamplePreset = { label: string; values: Partial<FormState> };

const VALID_FEATURE_IDS = new Set<FeatureId>([
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
]);

const MARKET_PRESETS = [
  { label: "SaaS", niche: "B2B SaaS growth", audience: "founders and growth leads" },
  { label: "Tech", niche: "AI and developer tools", audience: "builders and engineers" },
  { label: "Sales", niche: "outbound and pipeline", audience: "sales reps and SDRs" },
  { label: "Creator", niche: "creator monetization", audience: "content creators" },
  { label: "Ecom", niche: "ecommerce retention", audience: "DTC operators" },
  { label: "Agency", niche: "agency positioning", audience: "service business owners" },
] as const;

const INPUT_HELP: Partial<Record<FeatureId, Partial<Record<keyof FormState, string>>>> = {
  viralScorePredictor: {
    niche: "Defines the audience context and scoring baseline.",
    draft: "The exact post you want scored for virality.",
  },
  bestTimeToPost: {
    niche: "Helps match timing patterns to your content category.",
  },
  contentPerformancePrediction: {
    niche: "Sets benchmark behavior for your market.",
    draft: "The draft to forecast and optimize.",
  },
  viralHookIntelligence: {
    niche: "Your target topic lane for hook analysis.",
    samplePosts: "Paste 3+ relevant posts (one per line) to extract hook patterns.",
  },
  preLaunchOptimizer: {
    niche: "Sets audience context for optimization.",
    draft: "The post to improve before publishing.",
  },
  nicheTrendRadar: {
    niche: "The niche where trend signals should be tracked.",
  },
  growthStrategist: {
    niche: "Main market for your strategy roadmap.",
    goals: "What outcomes you want in the next 30 days.",
  },
  brandAnalyzer: {
    profile: "Current profile/bio/about text.",
    tweets: "5-10 recent tweets (one per line) for voice analysis.",
  },
  threadWriterPro: {
    topic: "Thread topic to develop.",
    goals: "What this thread should achieve (reach, leads, authority).",
  },
  leadMagnetGenerator: {
    source: "Source content to transform into a lead magnet.",
    audience: "Who this lead magnet is for.",
  },
  audiencePsychology: {
    niche: "Market you want psychological insight for.",
    audience: "Specific segment inside that niche.",
  },
  repurposingEngine: {
    source: "Your original post/thread to repurpose.",
  },
  monetizationToolkit: {
    niche: "Business niche to monetize.",
    audience: "Target buyer profile.",
  },
};

function splitLines(v: string) {
  return v.split("\n").map((x) => x.trim()).filter(Boolean);
}

function buildExamples(featureId: FeatureId): ExamplePreset[] {
  return MARKET_PRESETS.map((preset) => {
    switch (featureId) {
      case "viralScorePredictor":
        return {
          label: preset.label,
          values: {
            niche: preset.niche,
            draft: `Most ${preset.audience} are optimizing vanity metrics instead of compounding outcomes. Here is the system that changed results in 30 days.`,
          },
        };
      case "bestTimeToPost":
        return { label: preset.label, values: { niche: preset.niche } };
      case "contentPerformancePrediction":
        return {
          label: preset.label,
          values: {
            niche: preset.niche,
            draft: `If you're in ${preset.niche}, this one decision will impact reach and conversion more than posting frequency.`,
          },
        };
      case "viralHookIntelligence":
        return {
          label: preset.label,
          values: {
            niche: preset.niche,
            samplePosts: [
              `Most ${preset.audience} mistake consistency for strategy.`,
              `I stopped doing this in ${preset.niche} and results improved fast.`,
              `If your content has no clear decision point, it gets ignored.`,
            ].join("\n"),
          },
        };
      case "preLaunchOptimizer":
        return {
          label: preset.label,
          values: {
            niche: preset.niche,
            draft: `I tested 3 frameworks in ${preset.niche}. One doubled qualified engagement.`
          },
        };
      case "nicheTrendRadar":
        return { label: preset.label, values: { niche: preset.niche } };
      case "growthStrategist":
        return {
          label: preset.label,
          values: {
            niche: preset.niche,
            goals: `Grow authority and inbound pipeline from ${preset.audience} over 30 days.`,
          },
        };
      case "brandAnalyzer":
        return {
          label: preset.label,
          values: {
            profile: `I help ${preset.audience} grow using ${preset.niche} systems.`,
            tweets: [
              `Most people in ${preset.niche} are chasing noise.`,
              `A repeatable system beats random inspiration every time.`,
              `Positioning clarity is the highest leverage move.`,
              `You do not need more ideas. You need better execution loops.`,
              `Authority compounds when your POV is consistent.`
            ].join("\n"),
          },
        };
      case "threadWriterPro":
        return {
          label: preset.label,
          values: {
            topic: `${preset.niche}: 5 execution mistakes`,
            goals: `Drive engagement and lead intent from ${preset.audience}.`,
          },
        };
      case "leadMagnetGenerator":
        return {
          label: preset.label,
          values: {
            source: `A practical framework for ${preset.niche} execution from idea to conversion.`,
            audience: preset.audience,
          },
        };
      case "audiencePsychology":
        return { label: preset.label, values: { niche: preset.niche, audience: preset.audience } };
      case "repurposingEngine":
        return {
          label: preset.label,
          values: { source: `How I turned one ${preset.niche} insight into 10 content assets and 3 leads.` },
        };
      case "monetizationToolkit":
        return { label: preset.label, values: { niche: preset.niche, audience: preset.audience } };
      default:
        return { label: preset.label, values: { niche: preset.niche } };
    }
  });
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      {hint && <p className="text-xs text-slate-400 mt-1 mb-2">{hint}</p>}
      {children}
    </div>
  );
}

function ResultView({ data }: { data: any }) {
  if (!data) return null;
  return (
    <div className="mt-5 rounded-2xl border border-indigo-100 bg-white p-4 shadow-[0_6px_16px_rgba(92,100,230,0.06)]">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="py-3 border-b border-slate-100 last:border-b-0">
          <div className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">{key.replace(/([A-Z])/g, " $1")}</div>
          {Array.isArray(value) ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {value.map((item, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs">
                  {typeof item === "string" ? item : JSON.stringify(item)}
                </span>
              ))}
            </div>
          ) : value && typeof value === "object" ? (
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
                <div key={k} className="rounded-lg bg-slate-50 px-3 py-2">
                  <div className="text-[11px] text-slate-400">{k}</div>
                  <div className="text-sm font-semibold text-slate-700">{String(v)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-1 text-sm text-slate-700 leading-relaxed">{String(value)}</div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function FeatureDetailPage() {
  const router = useRouter();
  const params = useParams<{ featureId: string }>();
  const featureId = params?.featureId as FeatureId;

  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [feature, setFeature] = useState<FeatureCatalogItem | null>(null);

  const [state, setState] = useState<FormState>({
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
    if (!featureId || !VALID_FEATURE_IDS.has(featureId)) {
      router.replace("/dashboard/features");
      return;
    }

    api.billing.features()
      .then((list) => {
        const current = list.find((f) => f.id === featureId) || null;
        setFeature(current);
      })
      .catch(() => {
        toast.error("Failed to load feature access");
      });
  }, [featureId, router]);

  useEffect(() => {
    setResult(null);
  }, [featureId]);

  const meta = useMemo(() => FEATURE_UI_META[featureId], [featureId]);
  const inputHelp = INPUT_HELP[featureId] || {};
  const examples = useMemo(() => buildExamples(featureId), [featureId]);

  const runFeature = async () => {
    if (!feature?.enabled) {
      toast.error("Upgrade required for this feature");
      router.push("/dashboard/billing");
      return;
    }

    setRunning(true);
    setResult(null);

    try {
      let output: any;
      switch (featureId) {
        case "viralScorePredictor":
          output = await api.ai.viralScore(state.draft, state.niche);
          break;
        case "bestTimeToPost":
          output = await api.ai.bestTimePost(state.niche);
          break;
        case "contentPerformancePrediction":
          output = await api.ai.contentPredict(state.draft, state.niche);
          break;
        case "viralHookIntelligence":
          output = await api.ai.viralHookIntel(state.niche, splitLines(state.samplePosts));
          break;
        case "preLaunchOptimizer":
          output = await api.ai.preLaunchOptimize(state.draft, state.niche);
          break;
        case "nicheTrendRadar":
          output = await api.ai.trendRadar(state.niche);
          break;
        case "growthStrategist":
          output = await api.ai.growthStrategist(state.niche, state.goals);
          break;
        case "brandAnalyzer":
          output = await api.ai.brandAnalyzer(state.profile, splitLines(state.tweets));
          break;
        case "threadWriterPro":
          output = await api.ai.threadPro(state.topic, state.goals);
          break;
        case "leadMagnetGenerator":
          output = await api.ai.leadMagnet(state.source, state.audience);
          break;
        case "audiencePsychology":
          output = await api.ai.audiencePsychology(state.niche, state.audience);
          break;
        case "repurposingEngine":
          output = await api.ai.repurpose(state.source);
          break;
        case "monetizationToolkit":
          output = await api.ai.monetizationToolkit(state.niche, state.audience);
          break;
        default:
          output = null;
      }

      setResult(output);
      toast.success("Feature run completed");
    } catch (error: any) {
      toast.error(error?.message || "Execution failed");
    } finally {
      setRunning(false);
    }
  };

  const needs = {
    niche: ["viralScorePredictor", "bestTimeToPost", "contentPerformancePrediction", "viralHookIntelligence", "preLaunchOptimizer", "nicheTrendRadar", "growthStrategist", "audiencePsychology", "monetizationToolkit"].includes(featureId),
    draft: ["viralScorePredictor", "contentPerformancePrediction", "preLaunchOptimizer"].includes(featureId),
    samplePosts: featureId === "viralHookIntelligence",
    goals: ["growthStrategist", "threadWriterPro"].includes(featureId),
    topic: featureId === "threadWriterPro",
    profile: featureId === "brandAnalyzer",
    tweets: featureId === "brandAnalyzer",
    source: ["leadMagnetGenerator", "repurposingEngine"].includes(featureId),
    audience: ["leadMagnetGenerator", "audiencePsychology", "monetizationToolkit"].includes(featureId),
  };

  return (
    <div className="min-h-full p-5 bg-gradient-to-br from-violet-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto space-y-4">
        <section className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-[0_12px_36px_rgba(92,100,230,0.07)]">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-violet-500">Module Workspace</p>
              <h1 className="mt-2 text-2xl font-extrabold text-[#111111]">{meta?.hero || featureId}</h1>
              <p className="mt-1 text-sm text-slate-600">{meta?.prompt || feature?.description}</p>
            </div>
            <Link href="/dashboard/features" className="text-xs font-semibold text-violet-600 hover:text-violet-700">← Back to Modules</Link>
          </div>
          <div className={`mt-4 h-1 rounded-full bg-gradient-to-r ${meta?.accent || "from-indigo-500 to-violet-500"} opacity-40`} />
        </section>

        <section className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-[0_12px_36px_rgba(92,100,230,0.07)]">
          {feature && !feature.enabled && (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
              This module requires {feature.minimumPlan.toUpperCase()} plan access.
              <Link href="/dashboard/billing" className="ml-2 font-semibold underline">Upgrade</Link>
            </div>
          )}

          <div className="mb-4 rounded-xl border border-violet-100 bg-violet-50/50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-600 mb-2">How To Use</p>
            <p className="text-xs text-slate-600">
              Fill the required inputs below. Use one of the 6 market examples to auto-fill instantly, then run analysis.
            </p>
          </div>

          <div className="mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Examples (One-click presets)</p>
            <div className="flex flex-wrap gap-2">
              {examples.map((ex) => (
                <button
                  key={ex.label}
                  onClick={() => {
                    setState((s) => ({ ...s, ...ex.values }));
                    setResult(null);
                  }}
                  className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 hover:bg-violet-100"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {needs.niche && (
              <Field label="Niche" hint={inputHelp.niche}>
                <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm w-full" value={state.niche} onChange={(e) => setState((s) => ({ ...s, niche: e.target.value }))} placeholder="Niche" />
              </Field>
            )}
            {needs.audience && (
              <Field label="Audience" hint={inputHelp.audience}>
                <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm w-full" value={state.audience} onChange={(e) => setState((s) => ({ ...s, audience: e.target.value }))} placeholder="Audience" />
              </Field>
            )}
            {needs.topic && (
              <Field label="Topic" hint={inputHelp.topic}>
                <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm w-full" value={state.topic} onChange={(e) => setState((s) => ({ ...s, topic: e.target.value }))} placeholder="Topic" />
              </Field>
            )}
            {needs.goals && (
              <Field label="Goal / Objective" hint={inputHelp.goals}>
                <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm w-full" value={state.goals} onChange={(e) => setState((s) => ({ ...s, goals: e.target.value }))} placeholder="Goal / Objective" />
              </Field>
            )}
          </div>

          {needs.draft && (
            <Field label="Draft" hint={inputHelp.draft}>
              <textarea className="mt-1 h-24 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={state.draft} onChange={(e) => setState((s) => ({ ...s, draft: e.target.value }))} placeholder="Draft" />
            </Field>
          )}
          {needs.profile && (
            <Field label="Profile" hint={inputHelp.profile}>
              <textarea className="mt-1 h-20 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={state.profile} onChange={(e) => setState((s) => ({ ...s, profile: e.target.value }))} placeholder="Profile bio / profile summary" />
            </Field>
          )}
          {needs.samplePosts && (
            <Field label="Sample Posts" hint={inputHelp.samplePosts}>
              <textarea className="mt-1 h-28 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={state.samplePosts} onChange={(e) => setState((s) => ({ ...s, samplePosts: e.target.value }))} placeholder="Sample posts (one per line)" />
            </Field>
          )}
          {needs.tweets && (
            <Field label="Past Tweets" hint={inputHelp.tweets}>
              <textarea className="mt-1 h-28 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={state.tweets} onChange={(e) => setState((s) => ({ ...s, tweets: e.target.value }))} placeholder="Past tweets (one per line)" />
            </Field>
          )}
          {needs.source && (
            <Field label="Source Content" hint={inputHelp.source}>
              <textarea className="mt-1 h-28 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={state.source} onChange={(e) => setState((s) => ({ ...s, source: e.target.value }))} placeholder="Source content" />
            </Field>
          )}

          <div className="mt-4 flex justify-end">
            <button
              onClick={runFeature}
              disabled={running}
              className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
            >
              {running ? "Running..." : "Run Analysis"}
            </button>
          </div>

          <ResultView data={result} />
        </section>
      </div>
    </div>
  );
}
