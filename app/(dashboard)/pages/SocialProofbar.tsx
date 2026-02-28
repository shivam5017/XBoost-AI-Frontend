"use client";

import { useEffect, useRef, useState } from "react";

// Represents "as seen in / trusted by" publications or stats
const logos = [
  { name: "Product Hunt", sub: "#1 of the day" },
  { name: "Chrome Web Store", sub: "Editor's pick" },
  { name: "TechCrunch", sub: "Featured" },
  { name: "The Verge", sub: "Reviewed" },
  { name: "Hacker News", sub: "Top post" },
];

export default function SocialProofBar() {
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
    <section className="relative bg-[#f8f7ff] py-10 sm:py-14">
      {/* No borders at all — identical bg-[#f8f7ff] across all sections means seamless merge */}

      {/* Left + right soft fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-[#f8f7ff] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-[#f8f7ff] to-transparent z-10" />

      <div
        ref={ref}
        className="relative max-w-7xl mx-auto px-6 md:px-12"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}
      >
        <p className="text-center text-[11px] font-mono font-medium text-gray-300 uppercase tracking-widest mb-8">
          Trusted by 12,400+ creators · Featured in
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-14">
          {logos.map((l, i) => (
            <div
              key={l.name}
              className="flex flex-col items-center gap-1"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(8px)",
                transition: `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms`,
              }}
            >
              <span className="text-[13px] sm:text-[15px] font-bold text-gray-300 hover:text-gray-400 transition-colors tracking-tight">
                {l.name}
              </span>
              <span className="text-[10px] font-mono text-purple-400/70">
                {l.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}