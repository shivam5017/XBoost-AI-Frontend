"use client";

import { useEffect, useRef, useState } from "react";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "",
    desc: "For trying XBoost with basic daily limits.",
    features: [
      "5 AI replies/day",
      "Tweet composer 2/day",
      "Chrome extension access",
      "Web billing access",
    ],
    missing: [
      "Viral Score Predictor",
      "Best Time to Post",
      "Content Performance Prediction",
      "Viral Hook Intelligence",
      "Pre-Launch Optimizer",
      "Analytics dashboard",
      "Pro creator modules",
    ],
    cta: "Start Free",
    highlight: false,
  },
  {
    id: "starter",
    name: "Starter",
    price: "$4.99",
    period: "/mo",
    desc: "For creators who need unlimited generation.",
    features: [
      "Unlimited AI replies",
      "Unlimited tweet composer",
      "Viral Score Predictor",
      "Best Time to Post",
      "Content Performance Prediction",
      "Viral Hook Intelligence Engine",
      "Pre-Launch Optimizer",
      "Chrome extension access",
      "Priority generation",
    ],
    missing: ["Analytics dashboard", "Niche Trend Radar", "Growth Strategist Mode"],
    cta: "Get Starter",
    highlight: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$9.99",
    period: "/mo",
    desc: "Full product access including analytics on web.",
    features: [
      "Unlimited AI replies",
      "Unlimited tweet composer",
      "Viral Score + Best Time + Performance Prediction",
      "Viral Hook Intelligence + Pre-Launch Optimizer",
      "Analytics dashboard (web)",
      "Niche Trend Radar",
      "AI Growth Strategist + Brand Analyzer",
      "Thread Writer Pro+, Repurposing, Monetization Toolkit",
    ],
    missing: [],
    cta: "Get Pro",
    highlight: false,
  },
] as const;

function PricingCard({ plan, index }: { plan: (typeof plans)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative flex flex-col rounded-2xl p-8 transition-all duration-500 ${
        plan.highlight
          ? "bg-linear-to-b from-[#7c3aed] to-[#6366f1] border border-purple-400/30 shadow-[0_16px_64px_rgba(124,58,237,0.35)] scale-[1.02]"
          : "bg-white/80 border border-purple-500/10 hover:border-purple-400/25 hover:shadow-[0_8px_40px_rgba(124,58,237,0.07)] backdrop-blur-sm"
      }`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? plan.highlight
            ? "translateY(0) scale(1.02)"
            : "translateY(0)"
          : "translateY(28px)",
        transition: `opacity 0.6s ease ${index * 100}ms, transform 0.6s ease ${index * 100}ms`,
      }}
    >
      {plan.highlight && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-white text-[11px] font-bold text-[#7c3aed] tracking-wide shadow-sm whitespace-nowrap">
          MOST POPULAR
        </div>
      )}

      <div className="mb-6">
        <div
          className={`text-[11px] font-mono font-bold uppercase tracking-widest mb-3 ${
            plan.highlight ? "text-purple-200" : "text-purple-500"
          }`}
        >
          {plan.name}
        </div>
        <div className="flex items-end gap-1 mb-2">
          <span
            className={`font-extrabold text-4xl sm:text-5xl tracking-tight ${
              plan.highlight ? "text-white" : "text-[#1a0a2e]"
            }`}
          >
            {plan.price}
          </span>
          {plan.period && (
            <span
              className={`text-sm mb-1.5 ${
                plan.highlight ? "text-purple-200" : "text-gray-400"
              }`}
            >
              {plan.period}
            </span>
          )}
        </div>
        <p
          className={`text-[13px] leading-snug ${
            plan.highlight ? "text-purple-200" : "text-gray-400"
          }`}
        >
          {plan.desc}
        </p>
      </div>

      <div className={`h-px mb-6 ${plan.highlight ? "bg-white/15" : "bg-purple-500/10"}`} />

      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-3">
            <div
              className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                plan.highlight ? "bg-white/20" : "bg-purple-500/10"
              }`}
            >
              <svg
                className={`w-2.5 h-2.5 ${plan.highlight ? "text-white" : "text-purple-500"}`}
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M2 6l3 3 5-5"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className={`text-[13px] ${plan.highlight ? "text-white" : "text-gray-600"}`}>{f}</span>
          </li>
        ))}

        {plan.missing.map((f) => (
          <li key={f} className="flex items-center gap-3 opacity-35">
            <div className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center bg-gray-200">
              <svg className="w-2.5 h-2.5 text-gray-400" viewBox="0 0 12 12" fill="none">
                <path
                  d="M3 9l6-6M9 9L3 3"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="text-[13px] text-gray-400">{f}</span>
          </li>
        ))}
      </ul>

      <button
        className={`w-full py-3.5 rounded-xl text-[14px] font-semibold transition-all duration-200 active:scale-[0.99] ${
          plan.highlight
            ? "bg-white text-[#7c3aed] hover:bg-purple-50 shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
            : "bg-purple-500/8 border border-purple-500/20 text-[#7c3aed] hover:bg-purple-500/15 hover:border-purple-500/30"
        }`}
      >
        {plan.cta}
      </button>
    </div>
  );
}

export default function PricingSection() {
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
    <section className="relative bg-[#f8f7ff] overflow-hidden py-24 sm:py-32" id="pricing">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse_at_50%_0%,rgba(124,58,237,0.07),transparent_70%)]" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div
          ref={headRef}
          className="text-center max-w-xl mx-auto mb-16"
          style={{
            opacity: headVisible ? 1 : 0,
            transform: headVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
            <span className="text-[11px] font-medium text-purple-600 uppercase tracking-[0.08em] font-mono">
              Simple pricing
            </span>
          </div>
          <h2 className="font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-[1.05] tracking-[-0.03em] text-[#1a0a2e] mb-4">
            Free to start. <span className="bg-linear-to-r from-[#7c3aed] to-[#6366f1] bg-clip-text text-transparent">Pay as you grow.</span>
          </h2>
          <p className="text-[14px] leading-[1.7] text-gray-400">
            Extension handles fast compose. Analytics dashboard is available on web and unlocked on Pro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {plans.map((plan, i) => (
            <PricingCard key={plan.id} plan={plan} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
