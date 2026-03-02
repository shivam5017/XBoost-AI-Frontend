"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DashboardProvider, useDashboard } from "./context";
import PageLoader from "@/app/loading";

const navItems = [
  { label: "Overview", href: "/dashboard" },
  { label: "Modules", href: "/dashboard/features" },
  { label: "Upcoming", href: "/dashboard/upcoming" },
  { label: "Tweet Templates", href: "/dashboard/tweet-templates" },
  { label: "Analytics", href: "/dashboard/analytics" },
  { label: "Billing", href: "/dashboard/billing" },
];

function NavLinks({
  onNavigate,
  isAdmin,
}: {
  onNavigate?: () => void;
  isAdmin: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const items = isAdmin
    ? [...navItems, { label: "Admin", href: "/dashboard/admin" }, { label: "Settings", href: "/dashboard/settings" }]
    : [...navItems, { label: "Settings", href: "/dashboard/settings" }];

  return (
    <nav className="flex flex-col gap-2">
      {items.map((item) => {
        const active =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <button
            key={item.href}
            onClick={() => {
              router.push(item.href);
              onNavigate?.();
            }}
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
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useDashboard();
  const isAdmin = (user?.email || "").toLowerCase() === "shivammalik962@gmail.com";

  return (
    <>
      <h2 className="text-xl font-bold mb-10 text-[#111111]">
        XBoost <span className="text-[#7c3aed]">AI</span>
      </h2>

      <NavLinks onNavigate={onNavigate} isAdmin={isAdmin} />

      <div className="mt-auto flex flex-col gap-3 pt-10">
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

        <button
          onClick={async () => {
            onNavigate?.();
            await logout();
          }}
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
    </>
  );
}

function DesktopSidebar() {
  return (
    <aside className="w-64 border-r border-indigo-100 bg-white/80 backdrop-blur-xl p-6 hidden md:flex flex-col shadow-sm">
      <SidebarBody />
    </aside>
  );
}

function MobileTopBar({ onOpen }: { onOpen: () => void }) {
  return (
    <header className="md:hidden sticky top-0 z-30 border-b border-indigo-100 bg-white/90 backdrop-blur-xl px-4 py-3 flex items-center justify-between">
      <div className="text-base font-bold text-[#111111]">
        XBoost <span className="text-[#7c3aed]">AI</span>
      </div>
      <button
        onClick={onOpen}
        aria-label="Open dashboard navigation"
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-200 bg-white text-indigo-600 hover:bg-indigo-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    </header>
  );
}

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      <div
        onClick={onClose}
        className={`md:hidden fixed inset-0 z-40 bg-black/35 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`md:hidden fixed inset-y-0 right-0 z-50 w-72 max-w-[86vw] border-l border-indigo-100 bg-white p-6 shadow-2xl transform transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-indigo-600">Navigation</h3>
            <button
              onClick={onClose}
              aria-label="Close dashboard navigation"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-200 text-indigo-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <SidebarBody onNavigate={onClose} />
        </div>
      </aside>
    </>
  );
}

function LayoutInner({ children }: { children: ReactNode }) {
  const { loading } = useDashboard();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (loading) return <PageLoader />;

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[#f5f3ff] via-white to-[#eef2ff]">
      <DesktopSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileTopBar onOpen={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
      {!mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open dashboard navigation"
          className="md:hidden fixed bottom-4 right-4 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-[0_12px_28px_rgba(99,102,241,0.35)]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      )}
      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
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
