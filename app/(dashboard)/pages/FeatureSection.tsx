"use client";

import { useEffect, useRef, useState } from "react";

const features = [
  {
    icon: "🚀",
    title: "AI Growth Strategist Mode",
    desc: "Get a personalized 30-day content roadmap, niche pillars, competitor breakdown, and viral pattern guidance.",
    tag: "Pro",
  },
  {
    icon: "🪝",
    title: "Viral Hook Intelligence Engine",
    desc: "Analyze hook patterns from top posts, generate A/B hook variants, and score hook probability before posting.",
    tag: "Starter+",
  },
  {
    icon: "🧬",
    title: "AI Personal Brand Analyzer",
    desc: "Audit voice consistency, positioning clarity, and profile strength with bio rewrite and monetization suggestions.",
    tag: "Pro",
  },
  {
    icon: "📊",
    title: "Pre-Launch Optimizer",
    desc: "Predict likely engagement range, suggest best posting window, and refine CTA and final phrasing pre-publish.",
    tag: "Starter+",
  },
  {
    icon: "🧵",
    title: "AI Thread Writer Pro+",
    desc: "Generate high-retention story arcs, contrarian angles, layered CTAs, and conversion-aware closing blocks.",
    tag: "Pro",
  },
  {
    icon: "🧲",
    title: "Auto Lead Magnet Generator",
    desc: "Convert winning threads into checklist/PDF/Notion lead magnets to compound growth into owned assets.",
    tag: "Pro",
  },
  {
    icon: "🧠",
    title: "Audience Psychology Insights",
    desc: "Discover emotional and authority triggers that increase saves, follows, and intent-driven engagement.",
    tag: "Pro",
  },
  {
    icon: "♻️",
    title: "Content Repurposing Engine",
    desc: "Repurpose X content to LinkedIn posts, newsletters, carousel scripts, and short-video concepts in one flow.",
    tag: "Pro",
  },
  {
    icon: "📈",
    title: "Niche Trend Radar",
    desc: "Detect breakout conversations in your lane early, so your content lands before saturation hits.",
    tag: "Pro",
  },
  {
    icon: "💸",
    title: "Creator Monetization Toolkit",
    desc: "Build offer ideas, pricing strategy, launch calendar, and high-performing sales content from one workspace.",
    tag: "Pro",
  },
];

function FeatureCard({
  icon,
  title,
  desc,
  tag,
  index,
}: {
  icon: string;
  title: string;
  desc: string;
  tag: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="group relative rounded-2xl border border-violet-200/35 bg-white/85 backdrop-blur-sm p-7 hover:border-violet-400/40 hover:shadow-[0_12px_42px_rgba(124,58,237,0.1)] transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${index * 70}ms, transform 0.6s ease ${index * 70}ms, box-shadow 0.3s ease, border-color 0.3s ease`,
      }}
    >
      <div className="flex items-start justify-between mb-5">
        <div className="w-11 h-11 rounded-xl bg-violet-100 border border-violet-200/60 flex items-center justify-center text-xl">
          {icon}
        </div>
        <span className="text-[10px] font-mono font-semibold text-violet-700 bg-violet-100 border border-violet-200 px-2.5 py-1 rounded-full">
          {tag}
        </span>
      </div>

      <h3 className="font-bold text-[15px] text-[#111111] mb-2 tracking-tight">{title}</h3>
      <p className="text-[13px] leading-[1.65] text-slate-600">{desc}</p>

      <div className="absolute bottom-0 left-8 right-8 h-[1.5px] rounded-full bg-linear-to-r from-violet-500/0 via-violet-500/50 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}

export default function FeaturesSection() {
  const headRef = useRef<HTMLDivElement>(null);
  const [headVisible, setHeadVisible] = useState(false);

  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setHeadVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="relative bg-[#f8f7ff] overflow-hidden py-24 sm:py-32" id="features">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[780px] h-[520px] bg-[radial-gradient(ellipse_at_50%_50%,rgba(124,58,237,0.07),transparent_70%)]" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div
          ref={headRef}
          className="max-w-3xl mb-16"
          style={{
            opacity: headVisible ? 1 : 0,
            transform: headVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 border border-violet-200 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-pulse" />
            <span className="text-[11px] font-medium text-violet-700 uppercase tracking-[0.08em] font-mono">
              Full-funnel creator stack
            </span>
          </div>
          <h2 className="font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-[1.05] tracking-[-0.03em] text-[#111111] mb-4">
            XBoost <span className="text-violet-600">AI</span> is now a
            <br />
            complete growth system
          </h2>
          <p className="text-[14px] leading-[1.7] text-slate-600 max-w-2xl">
            From idea generation to conversion and monetization, these modules are built to turn content creators into durable personal brands.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
