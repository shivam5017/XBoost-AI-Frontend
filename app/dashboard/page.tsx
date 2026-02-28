"use client";

import { useDashboard } from "./context";

export default function DashboardPage() {
  const { user } = useDashboard();

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">
        Welcome, {user?.username ?? user?.email}
      </h1>
      <p className="mt-4 text-gray-600">Daily Goal: {user?.dailyGoal}</p>
    </div>
  );
}