"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { api, FeatureCatalogItem } from "@/utils/api";
import { toast } from "sonner";
import { FEATURE_HUB_ORDER, FEATURE_UI_META } from "./feature-meta";

function planChip(plan: "free" | "starter" | "pro") {
  if (plan === "starter") return "Starter";
  if (plan === "pro") return "Pro";
  return "Free";
}

export default function FeaturesPage() {
  const [loading, setLoading] = useState(true);
  const [features, setFeatures] = useState<FeatureCatalogItem[]>([]);

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

  const live = useMemo(
    () => features
      .filter((f) => f.availability === "live" && f.id !== "analytics")
      .sort((a, b) => FEATURE_HUB_ORDER.indexOf(a.id) - FEATURE_HUB_ORDER.indexOf(b.id)),
    [features],
  );

  const enabledCount = useMemo(() => live.filter((f) => f.enabled).length, [live]);
  const extensionUrl = "https://chromewebstore.google.com/detail/pohpmpfbaenppabefjbgjfdhncnkfpml";
  return (
    <div className="page-shell min-h-full p-5 flex flex-col gap-4">
      <section className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-[0_12px_36px_rgba(92,100,230,0.07)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-violet-500">Module Studio</p>
        <h1 className="mt-2 text-2xl font-extrabold text-gray-800">
          XBoost <span className="text-violet-600">AI</span> Modules
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Click any module to open a dedicated workspace. {enabledCount} of {live.length} modules are unlocked on your plan.
        </p>
        <a
          href={extensionUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-3 py-2 text-xs font-semibold text-white hover:opacity-90"
        >
          Open In Chrome Extension
        </a>
      </section>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {loading ? (
          <>
            <div className="h-40 rounded-2xl shimmer" />
            <div className="h-40 rounded-2xl shimmer" />
            <div className="h-40 rounded-2xl shimmer" />
            <div className="h-40 rounded-2xl shimmer" />
          </>
        ) : live.length === 0 ? (
          <div className="md:col-span-2 rounded-2xl border border-indigo-100 bg-white p-8 text-center shadow-[0_8px_24px_rgba(92,100,230,0.06)]">
            <p className="text-3xl">🧠</p>
            <p className="mt-2 text-sm font-semibold text-gray-800">No modules available yet</p>
            <p className="mt-1 text-xs text-slate-500">Your admin can publish modules from the catalog panel.</p>
          </div>
        ) : (
          live.map((feature) => {
            const meta = FEATURE_UI_META[feature.id];
            return (
              <Link
                key={feature.id}
                href={feature.enabled ? `/dashboard/features/${feature.id}` : "/dashboard/billing"}
                className="group rounded-2xl border border-indigo-100 bg-white p-5 shadow-[0_8px_28px_rgba(92,100,230,0.06)] hover:shadow-[0_14px_40px_rgba(92,100,230,0.12)] transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-bold text-gray-800">{meta?.hero || feature.name}</h3>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${feature.enabled ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                    {feature.enabled ? "Open" : "Upgrade"}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{feature.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full bg-violet-50 px-2 py-1 text-[10px] font-semibold text-violet-600">{planChip(feature.minimumPlan)}</span>
                  <span className="text-xs text-violet-600 group-hover:text-violet-700 font-semibold">
                    {feature.enabled ? "Open Workspace →" : "See Plans →"}
                  </span>
                </div>
                <div className={`mt-3 h-1 rounded-full bg-gradient-to-r ${meta?.accent || "from-indigo-500 to-violet-500"} opacity-25 group-hover:opacity-60`} />
              </Link>
            );
          })
        )}
      </section>
    </div>
  );
}
