"use client";
import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useStore } from "@/store/index";
import { api, ApiError } from "@/utils/api";
import { toast } from "sonner";

type Period = "day" | "week" | "month";

interface ActivityPoint {
  label: string;
  replies: number;
  aiUses: number;
  impressions: number;
}

interface StreakPoint {
  label: string;
  streak: number;
  score: number;
}

const PERIODS: { id: Period; label: string }[] = [
  { id: "day", label: "Today" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl px-3 py-2 border border-gray-100 shadow-lg text-xs">
      <div className="text-gray-400 mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="font-bold" style={{ color: p.color }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
}

function PeriodSwitcher({
  value,
  onChange,
}: {
  value: Period;
  onChange: (p: Period) => void;
}) {
  return (
    <div className="grid w-full grid-cols-3 gap-1 bg-gray-100 rounded-lg p-1 sm:w-auto">
      {PERIODS.map((p) => (
        <button
          key={p.id}
          onClick={() => onChange(p.id)}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-200 ${
            value === p.id
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
  period,
  onPeriodChange,
  loading,
  proOnly = false,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  period: Period;
  onPeriodChange: (p: Period) => void;
  loading?: boolean;
  proOnly?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-bold text-gray-800">{title}</div>
            {proOnly && (
              <span
                title="All Access (Pro) feature"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-50 text-violet-600 border border-violet-100"
              >
                <svg
                  className="w-3 h-3"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5.5 7V5.5a2.5 2.5 0 115 0V7M4.5 7h7a1 1 0 011 1v4a1 1 0 01-1 1h-7a1 1 0 01-1-1V8a1 1 0 011-1z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Pro
              </span>
            )}
          </div>
          {subtitle && (
            <div className="text-xs text-gray-400 mt-0.5">{subtitle}</div>
          )}
        </div>
        <div className="w-full sm:w-auto">
          <PeriodSwitcher value={period} onChange={onPeriodChange} />
        </div>
      </div>
      {loading ? (
        <div className="h-40 rounded-xl border border-indigo-100 bg-indigo-50/40 p-3">
          <div className="h-4 w-28 rounded-md shimmer mb-3" />
          <div className="h-24 w-full rounded-lg shimmer mb-2" />
          <div className="h-3 w-40 rounded-md shimmer" />
        </div>
      ) : (
        children
      )}
    </div>
  );
}

function StatBadge({
  label,
  value,
  colorClass = "text-indigo-600",
}: {
  label: string;
  value: string;
  colorClass?: string;
}) {
  return (
    <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 flex flex-col gap-1">
      <div className="text-xs text-gray-400">{label}</div>
      <div className={`text-lg font-bold ${colorClass}`}>{value}</div>
    </div>
  );
}

function fmtNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toString();
}

export default function AnalyticsPage() {
  const { dashboard, weeklyReport } = useStore();
  const loadDashboard = useStore((s) => s.loadDashboard);
  const loadWeekly = useStore((s) => s.loadWeekly);

  const [period, setPeriod] = useState<Period>("week");
  const [activityData, setActivityData] = useState<ActivityPoint[]>([]);
  const [streakData, setStreakData] = useState<StreakPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [accessChecked, setAccessChecked] = useState(false);
  const [hasAnalyticsAccess, setHasAnalyticsAccess] = useState(true);

  const fetchActivity = async (p: Period) => {
    if (!hasAnalyticsAccess) return;
    setLoading(true);
    try {
      const data = await api.analytics.activity(p);
      setActivityData(data.activity);
      setStreakData(
        data.streakHistory.map((s: any) => ({
          label: new Date(s.date).toLocaleDateString("en", {
            weekday: p === "month" ? undefined : "short",
            month: p === "month" ? "short" : undefined,
            day: p === "month" ? "numeric" : undefined,
          }),
          streak: s.repliesPosted,
          score: s.goalCompleted
            ? 100
            : Math.min(
                99,
                Math.round(
                  (s.repliesPosted / (dashboard?.today.goal ?? 5)) * 100,
                ),
              ),
        })),
      );
    } catch (e: any) {
      if (e instanceof ApiError && e.status === 403) {
        setHasAnalyticsAccess(false);
        return;
      }
      console.error(e);
      toast.error(e?.message || "Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const billing = await api.billing.subscription();
        const allowed = Boolean(billing?.plan?.features?.analytics);
        setHasAnalyticsAccess(allowed);
        if (!allowed) return;
        await Promise.all([loadDashboard(), loadWeekly()]);
      } catch (e: any) {
        if (e instanceof ApiError && e.status === 403) {
          setHasAnalyticsAccess(false);
        } else {
          toast.error(e?.message || "Failed to load analytics");
        }
      } finally {
        setAccessChecked(true);
      }
    };

    bootstrap();
  }, []);
  useEffect(() => {
    if (accessChecked && hasAnalyticsAccess) {
      fetchActivity(period);
    }
  }, [period, accessChecked, hasAnalyticsAccess]);

  const totals = dashboard?.totals;
  const streak = dashboard?.streak;
  const tickStyle = { fontSize: 10, fill: "#94a3b8" };
  const gridStyle = {
    stroke: "#f1f5f9",
    vertical: false as const,
    strokeDasharray: "3 3",
  };

  return (
    <div className="page-shell min-h-full p-5 flex flex-col gap-4">
      {!accessChecked ? (
        <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
          <div className="h-5 w-40 rounded-md shimmer mb-3" />
          <div className="h-20 w-full rounded-xl shimmer" />
        </div>
      ) : !hasAnalyticsAccess ? (
        <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-violet-600">
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
              <path
                d="M5.5 7V5.5a2.5 2.5 0 115 0V7M4.5 7h7a1 1 0 011 1v4a1 1 0 01-1 1h-7a1 1 0 01-1-1V8a1 1 0 011-1z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Pro Only
          </div>
          <h1 className="mt-3 text-xl font-bold text-gray-800">Analytics Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Analytics is available on the Pro plan. Upgrade to unlock growth charts, streak analytics, and reach insights.
          </p>
          <a
            href="/dashboard/billing"
            className="mt-4 inline-flex rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Upgrade to Pro
          </a>
        </div>
      ) : (
        <>
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-base font-bold text-gray-800">Analytics</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Track your growth and engagement over time
          </p>
        </div>
        {/* Global period switcher */}
        <div className="w-full sm:w-auto">
          <PeriodSwitcher value={period} onChange={setPeriod} />
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <StatBadge
          label="Total Replies"
          value={totals?.replies?.toString() ?? "0"}
          colorClass="text-indigo-600"
        />
        <StatBadge
          label="AI Uses"
          value={totals?.aiUsage?.toString() ?? "0"}
          colorClass="text-violet-600"
        />
        <StatBadge
          label="Best Streak"
          value={`${streak?.longest ?? 0} days`}
          colorClass="text-orange-500"
        />
        <StatBadge
          label="Est. Reach"
          value={fmtNum(weeklyReport?.estimatedImpressions ?? 0)}
          colorClass="text-emerald-600"
        />
      </div>

      {/* Replies & AI Uses */}
      <ChartCard
        title="Replies & AI Uses"
        subtitle="Generated vs AI-assisted"
        proOnly
        period={period}
        onPeriodChange={setPeriod}
        loading={loading}
      >
        <ResponsiveContainer width="100%" height={155}>
          <AreaChart
            data={activityData}
            margin={{ top: 4, right: 4, left: -26, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid {...gridStyle} />
            <XAxis
              dataKey="label"
              tick={tickStyle}
              axisLine={false}
              tickLine={false}
              tickMargin={5}
            />
            <YAxis
              tick={tickStyle}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#6366f1", strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="replies"
              name="Replies"
              stroke="#6366f1"
              strokeWidth={2.5}
              fill="url(#gR)"
              activeDot={{
                r: 4,
                fill: "#fff",
                stroke: "#6366f1",
                strokeWidth: 2,
              }}
            />
            <Area
              type="monotone"
              dataKey="aiUses"
              name="AI Uses"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#gA)"
              activeDot={{
                r: 4,
                fill: "#fff",
                stroke: "#8b5cf6",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 justify-end">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
            Replies
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500 inline-block" />
            AI Uses
          </span>
        </div>
      </ChartCard>

      {/* Impressions */}
      <ChartCard
        title="Estimated Impressions"
        subtitle="Reach from posted replies"
        proOnly
        period={period}
        onPeriodChange={setPeriod}
        loading={loading}
      >
        <ResponsiveContainer width="100%" height={145}>
          <AreaChart
            data={activityData}
            margin={{ top: 4, right: 4, left: -18, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gI" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid {...gridStyle} />
            <XAxis
              dataKey="label"
              tick={tickStyle}
              axisLine={false}
              tickLine={false}
              tickMargin={5}
            />
            <YAxis
              tick={tickStyle}
              axisLine={false}
              tickLine={false}
              tickFormatter={fmtNum}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#10b981", strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="impressions"
              name="Impressions"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#gI)"
              activeDot={{
                r: 4,
                fill: "#fff",
                stroke: "#10b981",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Streak */}
      <ChartCard
        title="Streak History"
        subtitle="Replies posted per day"
        proOnly
        period={period}
        onPeriodChange={setPeriod}
        loading={loading}
      >
        <ResponsiveContainer width="100%" height={135}>
          <BarChart
            data={streakData}
            margin={{ top: 4, right: 4, left: -26, bottom: 0 }}
          >
            <CartesianGrid {...gridStyle} />
            <XAxis
              dataKey="label"
              tick={tickStyle}
              axisLine={false}
              tickLine={false}
              tickMargin={5}
            />
            <YAxis
              tick={tickStyle}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(249,115,22,0.06)" }}
            />
            <Bar
              dataKey="streak"
              name="Replies"
              fill="#f97316"
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Consistency */}
      <ChartCard
        title="Consistency Score"
        subtitle="How often you hit your daily goal"
        proOnly
        period={period}
        onPeriodChange={setPeriod}
        loading={loading}
      >
        <ResponsiveContainer width="100%" height={135}>
          <AreaChart
            data={streakData}
            margin={{ top: 4, right: 4, left: -26, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gC" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid {...gridStyle} />
            <XAxis
              dataKey="label"
              tick={tickStyle}
              axisLine={false}
              tickLine={false}
              tickMargin={5}
            />
            <YAxis
              domain={[0, 100]}
              tick={tickStyle}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#6366f1", strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="score"
              name="Score"
              stroke="#6366f1"
              strokeWidth={2.5}
              fill="url(#gC)"
              activeDot={{
                r: 4,
                fill: "#fff",
                stroke: "#6366f1",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex justify-end gap-3 mt-2 text-xs text-gray-400">
          <span>
            Target: <strong className="text-indigo-500">80%</strong>
          </span>
          {weeklyReport && (
            <span>
              Current:{" "}
              <strong
                className={
                  weeklyReport.consistencyScore >= 80
                    ? "text-emerald-500"
                    : "text-orange-500"
                }
              >
                {weeklyReport.consistencyScore}%
              </strong>
            </span>
          )}
        </div>
      </ChartCard>

      {/* Weekly summary */}
      {weeklyReport && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="text-sm font-bold text-gray-800 mb-3">
            Weekly Summary
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <StatBadge
              label="Total Replies"
              value={weeklyReport.totalReplies.toString()}
              colorClass="text-indigo-600"
            />
            <StatBadge
              label="Avg / Day"
              value={weeklyReport.avgRepliesPerDay.toFixed(1)}
              colorClass="text-violet-600"
            />
            <StatBadge
              label="Consistency"
              value={`${weeklyReport.consistencyScore}%`}
              colorClass={
                weeklyReport.consistencyScore >= 80
                  ? "text-emerald-600"
                  : "text-orange-500"
              }
            />
            <StatBadge
              label="Growth Rating"
              value={weeklyReport.growthRating}
              colorClass="text-orange-500"
            />
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
