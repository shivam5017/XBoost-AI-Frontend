"use client";

import Logo from "@/app/components/Logo";
import { useEffect, useState } from "react";

const CHROME_STORE_URL =
  "https://chromewebstore.google.com/detail/pohpmpfbaenppabefjbgjfdhncnkfpml";

const navLinks = [
  { label: "Modules", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const current = typeof window !== "undefined" && localStorage.getItem("xboost_theme") === "dark"
      ? "dark"
      : "light";
    setTheme(current);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("xboost_theme", next);
    } catch {}
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          scrolled
            ? "bg-[#f8f7ff]/80 backdrop-blur-md border-b border-purple-500/10 shadow-[0_2px_24px_rgba(124,58,237,0.06)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0">
            <Logo size={30}/>
            <h2 className="font-extrabold text-[15px] tracking-tight text-[#1a0a2e]">
              XBoost <span className="text-[#7c3aed]">AI</span>
            </h2>
          </a>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 rounded-lg text-[13px] font-medium text-gray-500 hover:text-[#1a0a2e] hover:bg-purple-500/6 transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="h-9 w-9 rounded-[9px] border border-purple-500/20 text-gray-600 hover:text-purple-700 hover:border-purple-400/40 inline-flex items-center justify-center transition-all duration-200"
            >
              {theme === "dark" ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3a6 6 0 1 0 9 9 9 9 0 1 1-9-9z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
              )}
            </button>
            <a
              href="/auth/login"
              className="px-4 py-2 rounded-[9px] border border-purple-500/20 text-gray-600 text-[13px] font-medium hover:text-purple-700 hover:border-purple-400/40 transition-all duration-200 whitespace-nowrap"
            >
              Login
            </a>
            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-[9px] bg-linear-to-r from-[#7c3aed] to-[#6366f1] text-white text-[13px] font-semibold shadow-[0_4px_16px_rgba(124,58,237,0.28)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(124,58,237,0.38)] active:translate-y-0 transition-all duration-200 whitespace-nowrap"
            >
              ⚡ Add to Chrome
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-lg hover:bg-purple-500/6 transition-colors"
            aria-label="Toggle menu"
          >
            <span
              className={`w-5 h-px bg-[#1a0a2e] rounded-full transition-all duration-300 ${
                mobileOpen ? "rotate-45 translate-y-[6px]" : ""
              }`}
            />
            <span
              className={`w-5 h-px bg-[#1a0a2e] rounded-full transition-all duration-300 ${
                mobileOpen ? "opacity-0 scale-x-0" : ""
              }`}
            />
            <span
              className={`w-5 h-px bg-[#1a0a2e] rounded-full transition-all duration-300 ${
                mobileOpen ? "-rotate-45 -translate-y-[6px]" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-[#1a0a2e]/10 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`absolute top-16 left-4 right-4 rounded-2xl bg-[#f8f7ff]/95 backdrop-blur-md border border-purple-500/15 shadow-[0_16px_64px_rgba(124,58,237,0.12)] p-5 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
          }`}
        >
          {/* Links */}
          <nav className="flex flex-col gap-1 mb-5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl text-[14px] font-medium text-gray-500 hover:text-[#1a0a2e] hover:bg-purple-500/6 transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Divider */}
          <div className="h-px bg-purple-500/8 mb-4" />

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            <button
              onClick={toggleTheme}
              className="w-full py-3 rounded-xl border border-purple-500/20 text-[14px] font-medium text-gray-500 hover:text-[#7c3aed] hover:border-purple-400/30 text-center transition-all duration-200 inline-flex items-center justify-center gap-2"
            >
              {theme === "dark" ? "☾" : "☀"} {theme === "dark" ? "Dark" : "Light"} mode
            </button>
            <a
              href="/auth/login"
              className="w-full py-3 rounded-xl border border-purple-500/20 text-[14px] font-medium text-gray-500 hover:text-[#7c3aed] hover:border-purple-400/30 text-center transition-all duration-200"
            >
              Log in
            </a>
            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-linear-to-r from-[#7c3aed] to-[#6366f1] text-white text-[14px] font-semibold text-center shadow-[0_4px_16px_rgba(124,58,237,0.28)] transition-all duration-200"
            >
              ⚡ Add to Chrome — It's Free
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
