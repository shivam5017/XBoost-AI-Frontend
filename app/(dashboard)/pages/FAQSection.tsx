"use client";

import { useEffect, useRef, useState } from "react";

const faqs = [
  {
    q: "Does Xboost work with free X accounts?",
    a: "Yes. Xboost works with any X account — free or verified. The extension reads and enhances whatever is on the page.",
  },
  {
    q: "Will X ban me for using Xboost?",
    a: "No. Xboost is a read-only browser extension. It reads the page to give you suggestions but never posts on your behalf or interacts with X's API automatically.",
  },
  {
    q: "How does the AI Rewrite Engine work?",
    a: "It uses GPT-4o under the hood. When you click 'Rewrite', it reads your draft and rewrites it with better hooks, clearer structure, and optimized CTAs — all in your voice.",
  },
  {
    q: "Is my data private?",
    a: "Absolutely. We don't store your posts or profile data. The extension processes content locally and only sends your draft text to the AI API when you explicitly request a rewrite.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes. Cancel from your account dashboard in one click. You'll keep Pro access until the end of your billing cycle — no questions asked.",
  },
  {
    q: "Does Xboost support languages other than English?",
    a: "Currently the AI features work best in English, Spanish, and French. Support for more languages is rolling out in Q2 2025.",
  },
];

function FAQItem({
  faq,
  index,
}: {
  faq: (typeof faqs)[0];
  index: number;
}) {
  const [open, setOpen] = useState(false);
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
      className="border-b border-purple-500/10 last:border-0"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-10px)",
        transition: `opacity 0.5s ease ${index * 60}ms, transform 0.5s ease ${index * 60}ms`,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-[14px] font-semibold text-[#1a0a2e] group-hover:text-[#7c3aed] transition-colors pr-4">
          {faq.q}
        </span>
        <div className={`flex-shrink-0 w-6 h-6 rounded-full border border-purple-500/20 flex items-center justify-center transition-all duration-300 ${open ? "bg-purple-500 border-purple-500 rotate-45" : ""}`}>
          <svg className={`w-3 h-3 ${open ? "text-white" : "text-purple-400"}`} fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" d="M6 2v8M2 6h8" />
          </svg>
        </div>
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "200px" : "0px" }}
      >
        <p className="text-[13px] leading-[1.7] text-gray-400 pb-5">{faq.a}</p>
      </div>
    </div>
  );
}

export default function FAQAndCTASection() {
  const faqRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [faqVisible, setFaqVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    const observe = (
      ref: React.RefObject<HTMLDivElement | null>,
      setter: (v: boolean) => void
    ) => {
      const el = ref.current;
      if (!el) return;
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setter(true); obs.disconnect(); } },
        { threshold: 0.15 }
      );
      obs.observe(el);
      return () => obs.disconnect();
    };
    const c1 = observe(faqRef, setFaqVisible);
    const c2 = observe(ctaRef, setCtaVisible);
    return () => { c1?.(); c2?.(); };
  }, []);

  return (
    <>
      {/* ── FAQ ── */}
      <section className="relative bg-[#f8f7ff] overflow-hidden py-24 sm:py-32">
        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-16 items-start">
            {/* Left header */}
            <div
              ref={faqRef}
              className="lg:sticky lg:top-32"
              style={{
                opacity: faqVisible ? 1 : 0,
                transform: faqVisible ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.7s ease, transform 0.7s ease",
              }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
                <span className="text-[11px] font-medium text-purple-600 uppercase tracking-[0.08em] font-mono">
                  FAQ
                </span>
              </div>
              <h2 className="font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-[1.05] tracking-[-0.03em] text-[#1a0a2e] mb-4">
                Questions?
                <br />
                <span className="bg-linear-to-r from-[#7c3aed] to-[#6366f1] bg-clip-text text-transparent">
                  We've got answers.
                </span>
              </h2>
              <p className="text-[13px] leading-[1.7] text-gray-400">
                Still unsure?{" "}
                <a href="#" className="text-purple-500 hover:text-purple-600 underline underline-offset-2">
                  Chat with our team
                </a>
                .
              </p>
            </div>

            {/* Right: FAQs */}
            <div className="divide-y divide-transparent">
              {faqs.map((faq, i) => (
                <FAQItem key={faq.q} faq={faq} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative bg-[#f8f7ff] overflow-hidden pb-24 sm:pb-32">
        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <div
            ref={ctaRef}
            className="relative rounded-3xl overflow-hidden bg-linear-to-br from-[#7c3aed] via-[#6d28d9] to-[#6366f1] p-10 sm:p-16 text-center shadow-[0_24px_80px_rgba(124,58,237,0.35)]"
            style={{
              opacity: ctaVisible ? 1 : 0,
              transform: ctaVisible ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            {/* Noise texture overlay */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjY1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />

            {/* Glows inside */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-300/10 rounded-full blur-3xl" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-[11px] font-medium text-white uppercase tracking-[0.08em] font-mono">
                  Free to install
                </span>
              </div>

              <h2 className="font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-[1.05] tracking-[-0.03em] text-white mb-4 max-w-2xl mx-auto">
                Your next post could
                <br className="hidden sm:block" /> be your biggest one yet
              </h2>

              <p className="text-[14px] leading-[1.7] text-purple-200 max-w-md mx-auto mb-10">
                Join 12,400+ creators already using Xboost to grow faster, post
                smarter, and stop guessing.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-[#7c3aed] text-[15px] font-bold hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] active:translate-y-0 transition-all duration-200">
                  ⚡ Add to Chrome
                </button>
                <button className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/25 text-white text-[15px] font-medium hover:border-white/40 hover:bg-white/5 transition-all duration-200">
                  See it in action →
                </button>
              </div>

              <p className="mt-6 text-[11px] font-mono text-purple-300">
                No account required · Works in 30 seconds · Chrome only (Firefox coming soon)
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}