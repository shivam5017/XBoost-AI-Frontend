"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import IMG_SETTINGS from "@/public/settings.png";
import IMG_COMPOSE from "@/public/create.png";
import IMG_DASHBOARD from "@/public/dashboard.png";

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
<section className="relative min-h-screen flex items-center overflow-hidden bg-[#f8f7ff] pt-16">
      {/* Ambient Glows */}
      <div className="absolute w-225 h-225 -left-75 -top-75 pointer-events-none">
        <div className="w-full h-full bg-gradient-radial from-purple-500/7 to-transparent" />
      </div>

      <div className="absolute w-175 h-175 -right-25 -bottom-50 pointer-events-none">
        <div className="w-full h-full bg-gradient-radial from-indigo-500/6 to-transparent" />
      </div>

      {/* Grid */}
      <div className="absolute inset-0 bg-grid-mask pointer-events-none" />

      {/* Container */}
      <div className="relative w-full max-w-7xl mx-auto  md:px-12 px-6 grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] gap-24 items-center">
        {/* LEFT */}
        <div
          className={`max-w-none md:max-w-190 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-7">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-600 shadow-[0_0_8px_rgba(124,58,237,0.7)] animate-pulse" />
            <span className="text-[11px] font-medium text-purple-600 uppercase tracking-[0.08em] font-mono">
              Now in v2.0 — AI Powered
            </span>
          </div>
          {/* Title */}
          {/* Title */}
          <div className="mb-6">
            <h2 className="font-extrabold  text-3xl sm:text-4xl lg:text-5xl leading-[1.05] tracking-[-0.04em] text-[#1a0a2e]">
              Grow faster on X
            </h2>

            <h2 className="font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.03em] mt-2">
              <span className="bg-linear-to-r from-[#7c3aed] to-[#6366f1] bg-clip-text text-transparent">
                Powered by AI
              </span>
            </h2>
          </div>
          {/* Subtitle */}
         
          <p className="text-[14px] leading-[1.7] text-gray-500 max-w-140 mb-11">
            Amplify every post with real-time analytics and AI suggestions that
            turn good content into viral content.
          </p>
          
          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <button
              className="
      w-full sm:w-auto
      px-5 py-3
      sm:px-6 sm:py-3.5
      lg:px-7 lg:py-4
      text-sm sm:text-[15px] lg:text-base
      rounded-[10px]
      bg-linear-to-r from-[#7c3aed] to-[#6366f1]
      text-white font-semibold
      shadow-[0_8px_32px_rgba(124,58,237,0.28)]
      hover:-translate-y-0.5
      hover:shadow-[0_12px_40px_rgba(124,58,237,0.38)]
      active:translate-y-0
      transition-all duration-200 ease-out
      whitespace-nowrap
    "
            >
              ⚡ Add to Chrome — It's Free
            </button>

            <button
              className="
      w-full sm:w-auto
      px-5 py-3
      sm:px-6 sm:py-3.5
      lg:px-6 lg:py-4
      text-sm sm:text-[15px] lg:text-base
      rounded-[10px]
      border border-purple-500/20
      text-gray-500 font-medium
      hover:border-purple-600
      hover:text-purple-600
      active:scale-[0.99]
      transition-all duration-200 ease-out
      whitespace-nowrap
    "
            >
              See it in action →
            </button>
          </div>
          {/* Stats */}
          <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-purple-500/10">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {/* Stat 1 */}
              <div className="flex flex-col">
                <div
                  className="
        font-mono
        text-sm sm:text-base md:text-lg lg:text-xl
        text-[#1a0a2e]
        leading-none
      "
                >
                  284%
                </div>
                <div
                  className="
        text-xs sm:text-sm md:text-base lg:text-lg
        text-gray-400
        mt-1 sm:mt-2
        whitespace-nowrap
      "
                >
                  Avg. reach boost
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex flex-col">
                <div
                  className="
        font-mono
        text-sm sm:text-base md:text-lg lg:text-xl
        text-[#1a0a2e]
        leading-none
      "
                >
                  12.4K
                </div>
                <div
                  className="
        text-xs sm:text-sm md:text-base lg:text-lg
        text-gray-400
        mt-1 sm:mt-2
        whitespace-nowrap
      "
                >
                  Active users
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex flex-col">
                <div
                  className="
        font-mono
        text-sm sm:text-base md:text-lg lg:text-xl
        text-[#1a0a2e]
        leading-none
      "
                >
                  4.9 ★
                </div>
                <div
                  className="
        text-xs sm:text-sm md:text-base lg:text-lg
        text-gray-400
        mt-1 sm:mt-2
        whitespace-nowrap
      "
                >
                  Chrome store rating
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div
          className={`relative h-130 flex items-center justify-center transition-all duration-1000 delay-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            loaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
          }`}
        >
          {/* 3D Stack Wrapper */}
          <div
            className="
      group relative w-70 h-115 perspective-1200

      transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
      transform-[perspective(1200px)_rotateX(6deg)_rotateY(-10deg)_rotateZ(2.5deg)]
      group-hover:transform-[perspective(1200px)_rotateX(3deg)_rotateY(-6deg)_rotateZ(1.5deg)]
      will-change-transform
    "
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Front Card */}
            <div
              className="
        absolute w-65 rounded-2xl overflow-hidden bg-white border border-white
        shadow-[0_4px_6px_rgba(124,58,237,0.04),0_16px_48px_rgba(100,80,200,0.18),0_48px_96px_rgba(100,80,200,0.12)]
        transform-gpu transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
        bottom-45 left-1/2 z-3
        -translate-x-[30%] rotate-[2.5deg]
        group-hover:-translate-x-[28%] group-hover:rotate-[4deg] group-hover:-translate-y-4.5
        will-change-transform
      "
            >
              <Image src={IMG_DASHBOARD} alt="Dashboard" priority />
            </div>

            {/* Middle Card */}
            <div
              className="
        absolute w-65 rounded-2xl overflow-hidden bg-white border border-white shadow-xl
        transform-gpu transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
        bottom-22.5 left-1/2 z-2 opacity-85
        -translate-x-[40%] -rotate-1
        group-hover:-translate-x-[48%] group-hover:rotate-[-1.5deg] group-hover:-translate-y-2
        will-change-transform
      "
            >
              <Image src={IMG_COMPOSE} alt="Compose" />
            </div>

            {/* Back Card */}
            <div
              className="
        absolute w-65 rounded-2xl overflow-hidden bg-white border border-white shadow-xl
        transform-gpu transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
        bottom-0 left-1/2 z-1 opacity-60
        -translate-x-[48%] rotate-[-4deg]
        group-hover:-translate-x-[65%] group-hover:rotate-[-7deg] group-hover:translate-y-3.5
        will-change-transform
        filter-[blur(0.5px)_brightness(0.98)]
      "
            >
              <Image src={IMG_SETTINGS} alt="Settings" />
            </div>
          </div>

          {/* Edge masks */}
          <div className="absolute -bottom-16 -left-10 -right-10 h-50 bg-linear-to-t from-[#f8f7ff] via-[#f8f7ff]/60 to-transparent pointer-events-none" />
          <div className="absolute -right-14 -top-10 -bottom-10 w-45 bg-linear-to-l from-[#f8f7ff] via-[#f8f7ff]/50 to-transparent pointer-events-none" />
          <div className="absolute -left-14 -top-14 w-50 h-50 bg-[radial-gradient(circle_at_0%_0%,rgba(248,247,255,0.97)_30%,transparent_70%)] pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
