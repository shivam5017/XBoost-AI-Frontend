"use client";

import Logo from "@/app/components/Logo";

const links = {
  Product: ["Modules", "How it works", "Testimonials", "Pricing", "FAQ"],
  Legal: ["Privacy policy", "Terms of service", "Cookie policy"],
  Support: ["Help center", "Contact us"],
};

const linkMap: Record<string, string> = {
  Modules: "#features",
  "How it works": "#how-it-works",
  Testimonials: "#testimonials",
  Pricing: "#pricing",
  FAQ: "#faq",
  "Privacy policy": "/privacy-policy",
  "Terms of service": "/terms-of-service",
  "Cookie policy": "/cookie-policy",
  "Help center": "#faq",
  "Contact us": "mailto:shivammalik962@gmail.com",
};

export default function Footer() {
  return (
    <footer className="relative bg-[#f8f7ff] overflow-hidden pt-16 pb-10">
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-purple-500/8" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-[1.8fr_repeat(3,1fr)] gap-10 mb-14">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Logo size={30}/>
              <h2 className="font-extrabold text-[15px] tracking-tight text-[#1a0a2e]">
                Xboost <span className="text-[#7c3aed]">AI</span>
              </h2>
            </div>
            <p className="text-[13px] leading-[1.7] text-gray-400 max-w-[220px] mb-5">
              The AI browser extension that turns every post into a growth
              engine.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-3">
              {/* X / Twitter */}
              <a
                href="https://x.com/smshipps"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg border border-purple-500/15 bg-white/60 flex items-center justify-center text-gray-400 hover:text-[#7c3aed] hover:border-purple-400/30 transition-all duration-200"
                aria-label="X / Twitter"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.26 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <p className="text-[11px] font-mono font-bold text-[#1a0a2e] uppercase tracking-widest mb-4">
                {group}
              </p>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href={linkMap[item] ?? "#"}
                      className="text-[13px] text-gray-400 hover:text-[#7c3aed] transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="pt-6 border-t border-purple-500/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] font-mono text-gray-300">
            © {new Date().getFullYear()} Xboost AI. All rights reserved. · v1.1.1
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[12px] font-mono text-gray-300">
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
