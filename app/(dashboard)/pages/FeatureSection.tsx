"use client";

import { useEffect, useRef, useState } from "react";

const features = [
  {
    icon: "⚡",
    title: "Real-Time Analytics",
    desc: "See impressions, reach, and engagement update live as your post gains traction. No more refreshing.",
    tag: "Live data",
  },
  {
    icon: "🧠",
    title: "AI Rewrite Engine",
    desc: "One click rewrites your draft with hooks, CTAs, and pacing tuned for the X algorithm.",
    tag: "GPT-4o powered",
  },
  {
    icon: "💬",
    title: "Smart Reply Assistant",
    desc: "Suggests context-aware replies to trending threads so you stay visible without the effort.",
    tag: "Engagement",
  },
  {
    icon: "📈",
    title: "Viral Score Predictor",
    desc: "Before you post, see a predicted virality score based on 50+ signals from top-performing content.",
    tag: "Predictive AI",
  },
  {
    icon: "🎯",
    title: "Best Time to Post",
    desc: "Your unique audience is online at specific windows. Xboost finds them and schedules automatically.",
    tag: "Scheduling",
  },
  {
    icon: "🔍",
    title: "Niche Trend Radar",
    desc: "Spot rising topics in your niche 2–3 hours before they go mainstream and ride the wave first.",
    tag: "Trending",
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
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="group relative rounded-2xl border border-purple-500/10 bg-white/70 backdrop-blur-sm p-7 hover:border-purple-400/30 hover:shadow-[0_8px_40px_rgba(124,58,237,0.08)] transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${index * 80}ms, transform 0.6s ease ${index * 80}ms, box-shadow 0.3s ease, border-color 0.3s ease`,
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-5">
        <div className="w-11 h-11 rounded-xl bg-purple-500/8 border border-purple-500/15 flex items-center justify-center text-xl">
          {icon}
        </div>
        <span className="text-[10px] font-mono font-medium text-purple-500 bg-purple-500/8 border border-purple-500/15 px-2.5 py-1 rounded-full">
          {tag}
        </span>
      </div>

      <h3 className="font-bold text-[15px] text-[#1a0a2e] mb-2 tracking-tight">
        {title}
      </h3>
      <p className="text-[13px] leading-[1.65] text-gray-400">{desc}</p>

      {/* Hover accent line */}
      <div className="absolute bottom-0 left-8 right-8 h-[1.5px] rounded-full bg-linear-to-r from-[#7c3aed]/0 via-[#7c3aed]/40 to-[#6366f1]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
      ([e]) => { if (e.isIntersecting) { setHeadVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="relative bg-[#f8f7ff] overflow-hidden py-24 sm:py-32">
      {/* Ambient — centered so no hard edge bleeds at the top seam */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse_at_50%_50%,rgba(124,58,237,0.06),transparent_70%)]" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div
          ref={headRef}
          className="max-w-2xl mb-16"
          style={{
            opacity: headVisible ? 1 : 0,
            transform: headVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
            <span className="text-[11px] font-medium text-purple-600 uppercase tracking-[0.08em] font-mono">
              Everything you need
            </span>
          </div>
          <h2 className="font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-[1.05] tracking-[-0.03em] text-[#1a0a2e] mb-4">
            Built for creators who
            <br />
            <span className="bg-linear-to-r from-[#7c3aed] to-[#6366f1] bg-clip-text text-transparent">
              play to win
            </span>
          </h2>
          <p className="text-[14px] leading-[1.7] text-gray-400 max-w-lg">
            Six tools, one browser extension. Everything stacked to give your
            content an unfair advantage on X.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}