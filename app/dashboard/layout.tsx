"use client";

import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DashboardProvider, useDashboard } from "./context";
import PageLoader from "@/app/loading";

const navItems = [
  { label: "Overview", href: "/dashboard" },
  { label: "Analytics", href: "/dashboard/analytics" },
  { label: "Billing", href: "/dashboard/billing" },
  { label: "Settings", href: "/dashboard/settings" },
];

function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useDashboard();

  return (
    <aside className="w-64 border-r border-indigo-100 bg-white/80 backdrop-blur-xl p-6 hidden md:flex flex-col shadow-sm">
      <h2 className="text-xl font-bold mb-10 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
        XBoost AI
      </h2>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-3 pt-10">
        {/* User Info */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-indigo-50 border border-indigo-100">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {(user?.username ?? user?.email ?? "U")[0].toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-gray-700 truncate">
              {user?.username ?? "User"}
            </span>
            <span className="text-xs text-gray-400 truncate">{user?.email}</span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 w-full text-left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>

        <div className="text-[11px] text-gray-400 flex flex-wrap gap-2 justify-center">
          <a href="/privacy-policy" className="hover:text-indigo-500">Privacy</a>
          <span>·</span>
          <a href="/terms-of-service" className="hover:text-indigo-500">Terms</a>
          <span>·</span>
          <a href="/cookie-policy" className="hover:text-indigo-500">Cookies</a>
        </div>

        <div className="text-xs text-gray-400 text-center">© 2026 XBoost</div>
      </div>
    </aside>
  );
}

function LayoutInner({ children }: { children: ReactNode }) {
  const { loading } = useDashboard();
  if (loading) return <PageLoader />;

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[#f5f3ff] via-white to-[#eef2ff]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardProvider>
      <LayoutInner>{children}</LayoutInner>
    </DashboardProvider>
  );
}
