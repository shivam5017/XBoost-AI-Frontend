"use client";

import { useEffect, useRef, useState } from "react";

const testimonials = [
  {
    name: "Alex Rivera",
    handle: "@alexgrowthx",
    avatar: "AR",
    color: "from-violet-500 to-purple-600",
    text: "Went from 800 to 14K followers in 6 weeks. Xboost's viral predictor is genuinely scary accurate. I stopped guessing and started posting with confidence.",
    likes: "2.4K",
    reposts: "841",
    verified: true,
  },
  {
    name: "Priya Nair",
    handle: "@priyanairtech",
    avatar: "PN",
    color: "from-indigo-500 to-blue-600",
    text: "The AI rewrite tool alone is worth it. It took a mediocre thread I wrote at 11pm and turned it into my highest-performing post ever. 1.2M impressions.",
    likes: "5.1K",
    reposts: "1.2K",
    verified: true,
  },
  {
    name: "Marcus Okafor",
    handle: "@marcusbuildsx",
    avatar: "MO",
    color: "from-fuchsia-500 to-pink-600",
    text: "I was skeptical of 'AI tools for social media' but this is different. It actually understands context and doesn't make you sound like a robot.",
    likes: "987",
    reposts: "312",
    verified: false,
  },
  {
    name: "Sasha Kim",
    handle: "@sashakimcreates",
    avatar: "SK",
    color: "from-emerald-500 to-teal-600",
    text: "Real-time analytics inside X itself is a game changer. No more switching to third-party dashboards. Everything I need is right there.",
    likes: "1.8K",
    reposts: "503",
    verified: true,
  },
  {
    name: "Jordan Walsh",
    handle: "@jordanwalshco",
    avatar: "JW",
    color: "from-orange-500 to-amber-500",
    text: "Best 30 seconds I ever spent was installing Xboost. 3x reach in the first month and I barely changed my content strategy.",
    likes: "3.3K",
    reposts: "974",
    verified: false,
  },
  {
    name: "Léa Fontaine",
    handle: "@leafontatine",
    avatar: "LF",
    color: "from-rose-500 to-red-500",
    text: "The trend radar caught a niche topic 2 hours before it blew up. I posted first, got 400K impressions, and 2,000 new followers in a single day.",
    likes: "6.7K",
    reposts: "2.1K",
    verified: true,
  },
];

function TweetCard({
  t,
  index,
}: {
  t: (typeof testimonials)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="group rounded-2xl border border-purple-500/10 bg-white/80 backdrop-blur-sm p-6 hover:border-purple-400/25 hover:shadow-[0_8px_40px_rgba(124,58,237,0.07)] transition-all duration-400 break-inside-avoid mb-4"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.5s ease ${index * 60}ms, transform 0.5s ease ${index * 60}ms`,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full bg-linear-to-br ${t.color} flex items-center justify-center text-white text-[12px] font-bold`}>
            {t.avatar}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[14px] font-semibold text-[#1a0a2e]">
                {t.name}
              </span>
              {t.verified && (
                <svg className="w-4 h-4 text-[#7c3aed]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              )}
            </div>
            <div className="text-[12px] text-gray-400">{t.handle}</div>
          </div>
        </div>

        {/* X logo */}
        <svg className="w-4 h-4 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.26 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </div>

      {/* Text */}
      <p className="text-[13px] leading-[1.7] text-gray-500 mb-5">{t.text}</p>

      {/* Footer */}
      <div className="flex items-center gap-5 text-[12px] text-gray-300 font-mono">
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          {t.likes}
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
          </svg>
          {t.reposts}
        </span>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
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

  const col1 = testimonials.filter((_, i) => i % 3 === 0);
  const col2 = testimonials.filter((_, i) => i % 3 === 1);
  const col3 = testimonials.filter((_, i) => i % 3 === 2);

  return (
    <section className="relative bg-[#f8f7ff] overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse,rgba(124,58,237,0.05),transparent_55%)]" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div
          ref={headRef}
          className="text-center max-w-2xl mx-auto mb-16"
          style={{
            opacity: headVisible ? 1 : 0,
            transform: headVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
            <span className="text-[11px] font-medium text-purple-600 uppercase tracking-[0.08em] font-mono">
              12.4K happy creators
            </span>
          </div>
          <h2 className="font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-[1.05] tracking-[-0.03em] text-[#1a0a2e] mb-4">
            They grew. Now
            <br />
            <span className="bg-linear-to-r from-[#7c3aed] to-[#6366f1] bg-clip-text text-transparent">
              it's your turn
            </span>
          </h2>
          <p className="text-[14px] leading-[1.7] text-gray-400">
            Real results from real creators — no cherry-picking, no paid
            testimonials.
          </p>
        </div>

        {/* Masonry grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
          <div>{col1.map((t, i) => <TweetCard key={t.handle} t={t} index={i} />)}</div>
          <div className="sm:pt-8">{col2.map((t, i) => <TweetCard key={t.handle} t={t} index={i + 2} />)}</div>
          <div className="hidden lg:block lg:pt-4">{col3.map((t, i) => <TweetCard key={t.handle} t={t} index={i + 4} />)}</div>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse_at_50%_100%,rgba(124,58,237,0.07),transparent_70%)]" />
    </section>
  );
}