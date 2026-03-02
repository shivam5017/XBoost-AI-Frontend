"use client";

import React, { useEffect, useRef, useState } from "react";
import { useStore } from "@/store/index";
import type { Plan, PlanId, Payment } from "@/utils/api";
import { toast } from "sonner";

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(amount: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amount);
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

// ── Plan config — matches analytics indigo/violet/orange palette ──────────────

const PLAN_META: Record<PlanId, {
  accent: string;
  bg: string;
  border: string;
  dot: string;
  badge?: string;
  badgeBg: string;
  btnClass: string;
}> = {
  free: {
    accent: "text-gray-500",
    bg: "bg-gray-50",
    border: "border-gray-200",
    dot: "bg-gray-400",
    badgeBg: "",
    btnClass: "bg-gray-100 hover:bg-gray-200 text-gray-600",
  },
  starter: {
    accent: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    dot: "bg-indigo-500",
    badge: "POPULAR",
    badgeBg: "bg-indigo-500",
    btnClass: "bg-indigo-500 hover:bg-indigo-600 text-white",
  },
  pro: {
    accent: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    dot: "bg-violet-500",
    badge: "ALL ACCESS",
    badgeBg: "bg-violet-500",
    btnClass: "bg-violet-500 hover:bg-violet-600 text-white",
  },
};

const FEATURE_ROWS = [
  { key: "replies",   label: "AI Replies",    free: "5 / day", starter: "Unlimited", pro: "Unlimited" },
  { key: "tweets", label: "Tweet Composer", free: "2 / day", starter: "Unlimited", pro: "Unlimited" },
  { key: "analytics", label: "Analytics",      free: false,     starter: false,       pro: true },
  { key: "viralScore", label: "Viral Score Predictor", free: false, starter: true, pro: true },
  { key: "bestTime", label: "Best Time to Post", free: false, starter: true, pro: true },
  { key: "contentPredict", label: "Content Performance Prediction", free: false, starter: true, pro: true },
  { key: "hook", label: "Viral Hook Intelligence", free: false, starter: true, pro: true },
  { key: "optimizer", label: "Pre-Launch Optimizer", free: false, starter: true, pro: true },
  { key: "radar", label: "Niche Trend Radar", free: false, starter: false, pro: true },
  { key: "strategist", label: "Growth Strategist Mode", free: false, starter: false, pro: true },
  { key: "brand", label: "Personal Brand Analyzer", free: false, starter: false, pro: true },
];

// ── Icons ─────────────────────────────────────────────────────────────────────

const CheckIcon = () => (
  <svg className="w-3.5 h-3.5 text-indigo-500 shrink-0" viewBox="0 0 14 14" fill="none">
    <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const XIcon = () => (
  <svg className="w-3.5 h-3.5 text-gray-300 shrink-0" viewBox="0 0 14 14" fill="none">
    <path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const BoltIcon = () => (
  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
    <path d="M7 1L2.5 7H6L5 11L9.5 5H6L7 1z" />
  </svg>
);

const ExternalIcon = () => (
  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
    <path d="M5 2H2a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V7M7 1h4m0 0v4m0-4L5 7"
      stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── UsageBar ──────────────────────────────────────────────────────────────────

function UsageBar({ used, limit }: { used: number; limit: number | null }) {
  const unlimited = limit === null;
  const pct = unlimited ? 100 : Math.min((used / limit) * 100, 100);
  const warn = !unlimited && pct >= 80;

  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-gray-400 font-medium">Replies today</span>
        <span className={warn ? "text-orange-500 font-bold" : "text-indigo-600 font-semibold"}>
          {unlimited ? `${used} / ∞` : `${used} / ${limit}`}
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            warn ? "bg-orange-400" : "bg-gradient-to-r from-indigo-400 to-violet-500"
          }`}
          style={{ width: unlimited ? "18%" : `${pct}%`, opacity: unlimited ? 0.4 : 1 }}
        />
      </div>
    </div>
  );
}

// ── PlanCard ──────────────────────────────────────────────────────────────────

function PlanCard({
  plan, isCurrent, isUpgrade, loading, onSelect,
}: {
  plan: Plan;
  isCurrent: boolean;
  isUpgrade: boolean;
  loading: boolean;
  onSelect: () => void;
}) {
  const meta = PLAN_META[plan.id];
  const rows = FEATURE_ROWS.map(r => ({
    label: r.label,
    value: r[plan.id as keyof typeof r],
  }));
  const hasDiscount = Boolean(plan.pricing?.hasDiscount && plan.pricing?.basePrice > plan.price);
  const discountLabel = hasDiscount
    ? `${Math.round(plan.pricing?.discountPercent || 0)}% OFF`
    : null;

  return (
    <div className={`relative rounded-2xl p-5 border transition-all duration-200 ${
      isCurrent
        ? `${meta.bg} ${meta.border} shadow-sm`
        : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
    }`}>
      {meta.badge && (
        <span className={`absolute -top-2.5 left-1/2 -translate-x-1/2 ${meta.badgeBg} text-white text-[9px] font-bold tracking-widest px-2.5 py-0.5 rounded-full`}>
          {meta.badge}
        </span>
      )}

      {/* Price */}
      <div className="mb-4">
        {discountLabel && (
          <span className="inline-flex items-center mb-2 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold tracking-wide text-emerald-600">
            {discountLabel}
          </span>
        )}
        {hasDiscount ? (
          <div className="flex items-end gap-2">
            <span className="text-xl font-semibold text-gray-400 line-through">
              ${plan.pricing?.basePrice}
            </span>
            <span className={`text-3xl font-bold ${isCurrent ? meta.accent : "text-gray-800"}`}>
              ${plan.price}
            </span>
            <span className="text-xs text-gray-400 mb-1">/mo</span>
          </div>
        ) : (
          <div className="flex items-baseline gap-1">
            <span className={`text-3xl font-bold ${isCurrent ? meta.accent : "text-gray-800"}`}>
              {plan.price === 0 ? "Free" : `$${plan.price}`}
            </span>
            {plan.price > 0 && <span className="text-xs text-gray-400">/mo</span>}
          </div>
        )}
        {hasDiscount && plan.pricing?.discountCode ? (
          <div className="text-xs text-gray-400 mt-0.5">
            Offer code: <span className="font-semibold text-emerald-600">{plan.pricing.discountCode}</span>
          </div>
        ) : null}
        <div className="text-xs text-gray-400 mt-0.5">{plan.name}</div>
      </div>

      {/* Features */}
      <div className="flex flex-col gap-2.5 mb-5">
        {rows.map(row => (
          <div key={row.label} className="flex items-center gap-2">
            {row.value === false ? <XIcon /> : <CheckIcon />}
            <span className={`text-xs ${row.value === false ? "text-gray-300" : "text-gray-600"}`}>
              {row.value === true
                ? row.label
                : row.value === false
                ? row.label
                : `${row.label} — ${row.value}`}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      {isCurrent ? (
        <div className={`text-center text-[10px] font-bold tracking-widest ${meta.accent} border ${meta.border} rounded-xl py-2`}>
          ✓ Current Plan
        </div>
      ) : (
        <button
          onClick={onSelect}
          disabled={loading}
          className={`w-full py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-150 flex items-center justify-center gap-1.5 disabled:opacity-50 ${meta.btnClass}`}
        >
          {loading ? (
            <>
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing…
            </>
          ) : (
            <>{isUpgrade && <BoltIcon />}{plan.price === 0 ? "Downgrade" : "Upgrade"}</>
          )}
        </button>
      )}
    </div>
  );
}

// ── PaymentRow ────────────────────────────────────────────────────────────────

function PaymentRow({ payment }: { payment: Payment }) {
  const chip =
    payment.status === "succeeded" ? "text-emerald-600 bg-emerald-50"
    : payment.status === "failed"  ? "text-red-500 bg-red-50"
    : "text-orange-500 bg-orange-50";

  return (
    <div className="grid grid-cols-4 px-4 py-3 border-b border-gray-50 items-center text-xs hover:bg-gray-50/50 transition-colors last:border-0">
      <span className="text-gray-500">{fmtDate(payment.createdAt)}</span>
      <span className="text-gray-400 capitalize">{payment.planId}</span>
      <span className="text-gray-700 font-medium">{fmt(payment.amount, payment.currency)}</span>
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold w-fit ${chip}`}>
        {payment.status}
      </span>
    </div>
  );
}

// ── StatRow ───────────────────────────────────────────────────────────────────

function StatRow({ label, value, valueClass = "text-gray-700" }: {
  label: string; value: string; valueClass?: string;
}) {
  return (
    <div className="flex justify-between items-center px-4 py-3 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400">{label}</span>
      <span className={`text-xs font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────────

const Spinner = () => (
  <div className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
);

const PlansSkeleton = () => (
  <div className="grid grid-cols-1 gap-3">
    <div className="h-56 rounded-2xl shimmer" />
    <div className="h-56 rounded-2xl shimmer" />
    <div className="h-56 rounded-2xl shimmer" />
  </div>
);

const HistorySkeleton = () => (
  <div className="space-y-2 p-4">
    <div className="h-10 rounded-xl shimmer" />
    <div className="h-10 rounded-xl shimmer" />
    <div className="h-10 rounded-xl shimmer" />
    <div className="h-10 rounded-xl shimmer" />
  </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function BillingPage() {
  const {
    subscription, plans, payments,
    billingLoading, billingError,
    loadPlans, loadSubscription, loadPayments,
    startCheckout, syncCheckout, cancelSubscription, openPortal,
    clearBillingError,
  } = useStore();

  const [tab, setTab]               = useState<"plans" | "usage" | "history">("plans");
  const [checkingOut, setCheckingOut] = useState<PlanId | null>(null);
  const [showCancel, setShowCancel]   = useState(false);
  const lastBillingErrorRef = useRef<string | null>(null);

  useEffect(() => {
    loadPlans();
    loadSubscription();

    const pendingCheckoutId =
      typeof window !== "undefined"
        ? window.localStorage.getItem("xboost_pending_checkout_id")
        : null;
    const query =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : null;
    const queryState = query?.get("checkout");
    const queryCheckoutId =
      query?.get("checkoutId") ||
      query?.get("checkout_id") ||
      query?.get("session_id");
    const checkoutId = queryCheckoutId || pendingCheckoutId;

    // Try reconciliation whenever we have a checkout id.
    // This covers cases where Dodo does not append expected state params.
    if (checkoutId) {
      const runSync = async (attempt = 0) => {
        const synced = await syncCheckout(checkoutId);
        if (synced) {
          toast.success("Subscription updated successfully");
          window.localStorage.removeItem("xboost_pending_checkout_id");
          loadSubscription();
          loadPayments();
          return;
        }

        // Payment can stay "processing" briefly in Dodo test mode.
        if (attempt < 3) {
          window.setTimeout(() => {
            runSync(attempt + 1);
          }, 3000);
        }
      };

      runSync();
    }

    if (queryState === "cancel") {
      toast.info("Checkout cancelled");
    }

  }, [loadPayments, loadPlans, loadSubscription, syncCheckout]);

  useEffect(() => {
    if (billingError && billingError !== lastBillingErrorRef.current) {
      toast.error(billingError);
      lastBillingErrorRef.current = billingError;
    }
    if (!billingError) {
      lastBillingErrorRef.current = null;
    }
  }, [billingError]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      loadSubscription();
      if (tab === "history") loadPayments();
    }, 15000);

    return () => window.clearInterval(interval);
  }, [tab, loadPayments, loadSubscription]);
  useEffect(() => { if (tab === "history") loadPayments(); }, [tab]);

  const currentPlanId: PlanId = subscription?.subscription.planId ?? "free";
  const currentPlan            = subscription?.plan;
  const usage                  = subscription?.usage;
  const meta                   = PLAN_META[currentPlanId];

  const handleCheckout = async (planId: "starter" | "pro") => {
    setCheckingOut(planId);
    toast.loading(`Starting ${planId} checkout...`, { id: "billing-checkout" });
    await startCheckout(planId);
    toast.dismiss("billing-checkout");
    setCheckingOut(null);
  };

  const handleCancel = async () => {
    await cancelSubscription();
    toast.success("Subscription cancellation scheduled");
    setShowCancel(false);
  };

  return (
    <div className="page-shell min-h-full p-5 flex flex-col gap-4">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-base font-bold text-gray-800">Billing</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage your plan and usage</p>
        </div>
        {currentPlan && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${meta.bg} ${meta.border} ${meta.accent}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
            {currentPlan.name}
            {currentPlan.price > 0 && (
              currentPlan.pricing?.hasDiscount ? (
                <span className="text-gray-400 font-normal">
                  · <span className="line-through">${currentPlan.pricing.basePrice}</span> ${currentPlan.price}/mo
                </span>
              ) : (
                <span className="text-gray-400 font-normal">· ${currentPlan.price}/mo</span>
              )
            )}
            {currentPlan.pricing?.hasDiscount ? (
              <span className="ml-1 rounded-full bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600">
                {Math.round(currentPlan.pricing.discountPercent)}% OFF
              </span>
            ) : null}
          </div>
        )}
      </div>

      {/* ── Usage bar ── */}
      {usage && currentPlan && (
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <UsageBar used={usage.repliesCount} limit={currentPlan.limits.dailyReplies} />
        </div>
      )}

      {/* ── Error ── */}
      {billingError && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-500">
          <span>⚠ {billingError}</span>
          <button onClick={clearBillingError} className="text-red-400 hover:text-red-600 text-base leading-none">×</button>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {(["plans", "usage", "history"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 capitalize ${
              tab === t
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── PLANS TAB ── */}
      {tab === "plans" && (
        <>
          {billingLoading && !plans.length ? (
            <PlansSkeleton />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-3">
                {plans.map(plan => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    isCurrent={plan.id === currentPlanId}
                    isUpgrade={plan.price > (currentPlan?.price ?? 0)}
                    loading={checkingOut === plan.id}
                    onSelect={() => {
                      if (plan.id !== "free") handleCheckout(plan.id as "starter" | "pro");
                    }}
                  />
                ))}
              </div>

              {/* Comparison table */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="grid grid-cols-4 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Feature</span>
                  {(["free", "starter", "pro"] as PlanId[]).map(p => (
                    <span key={p} className={`text-[10px] font-bold uppercase tracking-wider text-center ${PLAN_META[p].accent}`}>
                      {p}
                    </span>
                  ))}
                </div>
                {FEATURE_ROWS.map((row, i) => (
                  <div key={row.key} className={`grid grid-cols-4 px-4 py-3 items-center ${i < FEATURE_ROWS.length - 1 ? "border-b border-gray-50" : ""}`}>
                    <span className="text-xs text-gray-500">{row.label}</span>
                    {([row.free, row.starter, row.pro] as (string | boolean)[]).map((v, j) => (
                      <div key={j} className="flex justify-center">
                        {v === false ? <XIcon />
                          : v === true  ? <CheckIcon />
                          : <span className={`text-[11px] font-semibold ${PLAN_META[(["free","starter","pro"] as PlanId[])[j]].accent}`}>{v}</span>
                        }
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Manage strip */}
              {currentPlanId !== "free" && (
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <div className="text-xs font-semibold text-gray-700 mb-0.5">Manage Subscription</div>
                    {subscription?.subscription.currentPeriodEnd && (
                      <div className="text-xs text-gray-400">
                        {subscription.subscription.cancelAtPeriodEnd
                          ? `Access ends ${fmtDate(subscription.subscription.currentPeriodEnd)}`
                          : `Renews ${fmtDate(subscription.subscription.currentPeriodEnd)}`}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={openPortal}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-gray-500 transition-colors"
                    >
                      Portal <ExternalIcon />
                    </button>
                    {!subscription?.subscription.cancelAtPeriodEnd && (
                      <button
                        onClick={() => setShowCancel(true)}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl text-xs font-semibold text-red-400 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ── USAGE TAB ── */}
      {tab === "usage" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <StatRow label="Plan" value={currentPlan?.name ?? "—"} valueClass="text-indigo-600" />
          <StatRow
            label="Replies today"
            value={usage
              ? (usage.remainingReplies == null
                  ? `${usage.repliesCount} (unlimited)`
                  : `${usage.repliesCount} / ${currentPlan?.limits.dailyReplies}`)
              : "—"}
          />
          <StatRow
            label="Remaining"
            value={usage?.remainingReplies == null ? "Unlimited" : `${usage.remainingReplies} left`}
            valueClass={typeof usage?.remainingReplies === "number" && usage.remainingReplies <= 1 ? "text-orange-500" : "text-emerald-600"}
          />
          <StatRow
            label="Tweet Composer"
            value={currentPlan?.features.tweets ? "✓ Enabled" : "✗ Not included"}
            valueClass={currentPlan?.features.tweets ? "text-emerald-600" : "text-gray-400"}
          />
          <StatRow
            label="Analytics"
            value={currentPlan?.features.analytics ? "✓ Enabled" : "✗ Pro required"}
            valueClass={currentPlan?.features.analytics ? "text-emerald-600" : "text-gray-400"}
          />
          <StatRow
            label="Status"
            value={subscription?.subscription.status ?? "—"}
            valueClass={subscription?.subscription.status === "active" ? "text-emerald-600" : "text-orange-500"}
          />
        </div>
      )}

      {/* ── HISTORY TAB ── */}
      {tab === "history" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-4 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
            {["Date", "Plan", "Amount", "Status"].map(h => (
              <span key={h} className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{h}</span>
            ))}
          </div>
          {billingLoading ? (
            <HistorySkeleton />
          ) : payments.length === 0 ? (
            <div className="py-10 text-center text-xs text-gray-300">No payment history yet</div>
          ) : (
            payments.map(p => <PaymentRow key={p.id} payment={p} />)
          )}
        </div>
      )}

      {/* ── Footer ── */}
      <p className="text-center text-[10px] text-gray-300 pb-1">
        Powered by Dodo Payments · Cancel anytime · No hidden fees
      </p>

      {/* ── Cancel modal ── */}
      {showCancel && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl border border-gray-100">
            <div className="text-sm font-bold text-red-500 mb-2">Cancel Subscription?</div>
            <p className="text-xs text-gray-500 leading-relaxed mb-5">
              Your plan stays active until the end of the billing period. After that, you'll be moved to the Free plan.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowCancel(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-semibold text-gray-600 transition-colors"
              >
                Keep Plan
              </button>
              <button
                onClick={handleCancel}
                disabled={billingLoading}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 rounded-xl text-xs font-bold text-white transition-colors flex items-center gap-1.5"
              >
                {billingLoading ? (
                  <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Cancelling…</>
                ) : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
