import type { FeatureId } from "@/utils/api";

export const FEATURE_HUB_ORDER: FeatureId[] = [
  "viralScorePredictor",
  "bestTimeToPost",
  "contentPerformancePrediction",
  "viralHookIntelligence",
  "preLaunchOptimizer",
  "nicheTrendRadar",
  "growthStrategist",
  "brandAnalyzer",
  "threadWriterPro",
  "leadMagnetGenerator",
  "audiencePsychology",
  "repurposingEngine",
  "monetizationToolkit",
];

export const FEATURE_UI_META: Record<FeatureId, { hero: string; accent: string; prompt: string }> = {
  analytics: { hero: "Analytics Dashboard", accent: "from-indigo-500 to-violet-500", prompt: "Web analytics for your account." },
  viralScorePredictor: { hero: "Viral Score Predictor", accent: "from-violet-500 to-indigo-500", prompt: "Get factor-level virality scoring before you post." },
  bestTimeToPost: { hero: "Best Time to Post", accent: "from-blue-500 to-indigo-500", prompt: "Find your highest probability posting windows." },
  contentPerformancePrediction: { hero: "Content Performance Prediction", accent: "from-indigo-500 to-blue-500", prompt: "Forecast engagement and edit toward stronger outcomes." },
  viralHookIntelligence: { hero: "Viral Hook Intelligence", accent: "from-fuchsia-500 to-violet-500", prompt: "Generate and test high-performing hook variants." },
  preLaunchOptimizer: { hero: "Pre-Launch Optimizer", accent: "from-violet-500 to-purple-500", prompt: "Improve CTA, timing, and draft quality before publishing." },
  nicheTrendRadar: { hero: "Niche Trend Radar", accent: "from-sky-500 to-indigo-500", prompt: "Spot topic momentum in your niche early." },
  growthStrategist: { hero: "AI Growth Strategist", accent: "from-purple-500 to-indigo-500", prompt: "Generate a 30-day execution roadmap with content pillars." },
  brandAnalyzer: { hero: "Personal Brand Analyzer", accent: "from-violet-500 to-pink-500", prompt: "Audit voice clarity and positioning with actionable fixes." },
  threadWriterPro: { hero: "Thread Writer Pro+", accent: "from-indigo-500 to-violet-500", prompt: "Build high-retention story arcs with strategic CTA flow." },
  leadMagnetGenerator: { hero: "Lead Magnet Generator", accent: "from-violet-500 to-indigo-500", prompt: "Turn ideas into checklists, templates, and mini-assets." },
  audiencePsychology: { hero: "Audience Psychology", accent: "from-indigo-500 to-purple-500", prompt: "Reveal behavioral triggers for follows, saves, and replies." },
  repurposingEngine: { hero: "Repurposing Engine", accent: "from-blue-500 to-violet-500", prompt: "Transform one idea into multi-channel content assets." },
  monetizationToolkit: { hero: "Monetization Toolkit", accent: "from-violet-500 to-indigo-500", prompt: "Design offers, pricing, and launch sequences that convert." },
};
