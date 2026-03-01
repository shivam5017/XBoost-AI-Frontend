"use client";

import { useEffect, useMemo, useState } from "react";
import { api, TweetTemplate } from "@/utils/api";
import { toast } from "sonner";

const TARGET_CHIP: Record<string, string> = {
  both: "Both",
  tweet: "Tweet",
  reply: "Reply",
};

export default function TweetTemplatesPage() {
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<TweetTemplate[]>([]);
  const [query, setQuery] = useState("");
  const [target, setTarget] = useState<"all" | "tweet" | "reply">("all");

  useEffect(() => {
    api.ai
      .templateCatalog()
      .then((rows) => setTemplates(rows.filter((row) => row.isActive)))
      .catch((error: any) => toast.error(error?.message || "Failed to load templates"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return templates.filter((template) => {
      const byTarget =
        target === "all" || template.target === "both" || template.target === target;
      const q = query.trim().toLowerCase();
      const byQuery =
        !q ||
        template.label.toLowerCase().includes(q) ||
        template.instruction.toLowerCase().includes(q) ||
        (template.category || "").toLowerCase().includes(q);
      return byTarget && byQuery;
    });
  }, [templates, query, target]);

  return (
    <div className="max-w-6xl mx-auto py-4 space-y-5">
      <section className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/90 via-white to-violet-50/90 p-6 shadow-[0_18px_48px_rgba(92,100,230,0.1)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-indigo-500">Tweet Templates</p>
        <h1 className="mt-2 text-3xl font-extrabold text-[#111111]">Structured Formats Library</h1>
        <p className="mt-2 text-sm text-slate-600">
          Templates are loaded live from backend admin and shared across web + extension.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {(["all", "tweet", "reply"] as const).map((item) => (
            <button
              key={item}
              onClick={() => setTarget(item)}
              className={`rounded-full px-3 py-1 text-xs font-semibold border ${
                target === item
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-violet-200"
              }`}
            >
              {item === "all" ? "All" : item === "tweet" ? "Tweet" : "Reply"}
            </button>
          ))}
        </div>

        <div className="mt-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by label, category, or instruction"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-300"
          />
        </div>
      </section>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-36 rounded-2xl shimmer" />
          <div className="h-36 rounded-2xl shimmer" />
          <div className="h-36 rounded-2xl shimmer" />
          <div className="h-36 rounded-2xl shimmer" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500 text-center">
          No templates match your current filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((tpl) => (
            <article
              key={tpl.slug}
              className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-[0_8px_24px_rgba(92,100,230,0.06)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-[#111111]">
                    {tpl.emoji} {tpl.label}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400 uppercase tracking-wide">{tpl.slug}</p>
                </div>
                <div className="flex gap-2">
                  <span className="rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                    {TARGET_CHIP[tpl.target] || "Both"}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                    {tpl.category}
                  </span>
                </div>
              </div>

              <p className="mt-3 text-sm text-slate-700 leading-relaxed">{tpl.instruction}</p>

              {tpl.structure && (
                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Structure</p>
                  <pre className="mt-1 whitespace-pre-wrap text-xs text-slate-700 font-medium">{tpl.structure}</pre>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
