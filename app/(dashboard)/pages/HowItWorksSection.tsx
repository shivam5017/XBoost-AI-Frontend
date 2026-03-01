"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    number: "01",
    title: "Install in seconds",
    desc: "Add Xboost to Chrome from the Web Store. No account needed to start — just pin it and go.",
    detail: "One-click install · Zero config · Works instantly",
  },
  {
    number: "02",
    title: "Open X as usual",
    desc: "Browse, scroll, and draft like normal. Xboost quietly activates in the background the moment you land on X.",
    detail: "Auto-detects X · No separate tab · Always on",
  },
  {
    number: "03",
    title: "Write smarter",
    desc: "As you type, the AI overlay scores your draft, suggests rewrites, and flags the best time to post.",
    detail: "Live scoring · AI rewrites · Hook suggestions",
  },
  {
    number: "04",
    title: "Watch your reach explode",
    desc: "Hit post and watch the real-time dashboard track impressions, replies, and follower growth in live.",
    detail: "Live analytics · Growth tracking · Daily reports",
  },
];

function Step({
  step,
  index,
  isLast,
}: {
  step: (typeof steps)[0];
  index: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative flex gap-6 sm:gap-8"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-20px)",
        transition: `opacity 0.6s ease ${index * 120}ms, transform 0.6s ease ${index * 120}ms`,
      }}
    >
      {/* Left: number + line */}
      <div className="flex flex-col items-center">
        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white border border-purple-500/20 shadow-[0_4px_20px_rgba(124,58,237,0.08)] flex items-center justify-center">
          <span className="font-mono text-[13px] font-bold text-[#7c3aed]">
            {step.number}
          </span>
        </div>
        {!isLast && (
          <div className="flex-1 w-px bg-linear-to-b from-purple-400/30 to-transparent mt-3" />
        )}
      </div>

      {/* Right: content */}
      <div className={`pb-12 ${isLast ? "pb-0" : ""}`}>
        <h3 className="font-bold text-[17px] text-[#1a0a2e] tracking-tight mb-2">
          {step.title}
        </h3>
        <p className="text-[13px] leading-[1.7] text-gray-400 mb-3 max-w-md">
          {step.desc}
        </p>
        <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-purple-500">
          {step.detail.split(" · ").map((d, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-purple-300">·</span>}
              {d}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HowItWorksSection() {
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
    <section className="relative bg-[#f8f7ff] overflow-hidden py-24 sm:py-32" id="how-it-works">
      {/* Ambient — pulled inward so it fully fades before the section edge */}
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.06),transparent_65%)]" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left: sticky header */}
          <div
            ref={headRef}
            className="lg:sticky lg:top-32"
            style={{
              opacity: headVisible ? 1 : 0,
              transform: headVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
              <span className="text-[11px] font-medium text-purple-600 uppercase tracking-[0.08em] font-mono">
                How it works
              </span>
            </div>
            <h2 className="font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-[1.05] tracking-[-0.03em] text-[#1a0a2e] mb-5">
              From install to
              <br />
              <span className="bg-linear-to-r from-[#7c3aed] to-[#6366f1] bg-clip-text text-transparent">
                viral in minutes
              </span>
            </h2>
            <p className="text-[14px] leading-[1.7] text-gray-400 max-w-sm mb-8">
              Xboost is designed to disappear into your workflow — no dashboard
              to learn, no settings to configure.
            </p>

            {/* Mini stat */}
            <div className="inline-flex items-center gap-4 px-5 py-4 rounded-2xl bg-white border border-purple-500/15 shadow-[0_4px_24px_rgba(124,58,237,0.06)]">
              <div className="font-mono text-2xl font-extrabold text-[#7c3aed]">
                ~2 min
              </div>
              <div className="text-[12px] text-gray-400 leading-snug">
                Average time from install
                <br />
                to first AI suggestion
              </div>
            </div>
          </div>

          {/* Right: steps */}
          <div className="pt-2">
            {steps.map((step, i) => (
              <Step key={step.number} step={step} index={i} isLast={i === steps.length - 1} />
            ))}
          </div>
        </div>
      </div>
      
    </section>
  );
}
