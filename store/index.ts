import { create } from "zustand";
import type {
  User,
  DashboardData,
  WeeklyReport,
  Plan,
  PlanId,
  Payment,
  BillingSubscriptionResponse,
} from "../utils/api";
import { api } from "../utils/api";

interface AppState {
  user: User | null;
  dashboard: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  weeklyReport: WeeklyReport | null;
  plans: Plan[];
  subscription: BillingSubscriptionResponse | null;
  payments: Payment[];
  billingLoading: boolean;
  billingError: string | null;

  setUser: (user: User | null) => void;
  setDashboard: (data: DashboardData | null) => void;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
  clearError: () => void;
  clearBillingError: () => void;

  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    username?: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  loadDashboard: () => Promise<void>;
  loadWeekly: () => Promise<void>;
  loadPlans: () => Promise<void>;
  loadSubscription: () => Promise<void>;
  loadPayments: () => Promise<void>;
  startCheckout: (planId: PlanId) => Promise<void>;
  syncCheckout: (checkoutId: string) => Promise<void>;
  openPortal: () => Promise<void>;
  cancelSubscription: () => Promise<void>;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  dashboard: null,
  isLoading: false,
  error: null,
  weeklyReport: null,
  plans: [],
  subscription: null,
  payments: [],
  billingLoading: false,
  billingError: null,

  setUser: (user) => set({ user }),
  setDashboard: (dashboard) => set({ dashboard }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  clearBillingError: () => set({ billingError: null }),

  // ✅ LOGIN
  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });

      const { user } = await api.auth.login(email, password);

      set({
        user,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.message || "Login failed",
        isLoading: false,
      });
    }
  },

  // ✅ REGISTER
  register: async (email, password, username) => {
    try {
      set({ isLoading: true, error: null });

      const { user } = await api.auth.register(email, password, username);

      set({
        user,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.message || "Registration failed",
        isLoading: false,
      });
    }
  },

  logout: async () => {
    try {
      await api.auth.logout();
    } catch (err) {
      console.error("Logout failed", err);
    }

    set({
      user: null,
      dashboard: null,
      error: null,
    });
  },

  // ✅ CHECK AUTH (auto login for extension open)
  checkAuth: async () => {
    try {
      set({ isLoading: true });

      const user = await api.auth.profile();

      set({
        user,
        isLoading: false,
      });
    } catch {
      set({
        user: null,
        isLoading: false,
      });
    }
  },

  // ✅ LOAD DASHBOARD
  loadDashboard: async () => {
    try {
      set({ isLoading: true });

      const data = await api.analytics.dashboard();

      set({
        dashboard: data,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.message || "Failed to load dashboard",
        isLoading: false,
      });
    }
  },

  loadWeekly: async () => {
    try {
      set({ isLoading: true });

      const report = await api.analytics.weekly();

      set({
        weeklyReport: report,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.message || "Failed to load weekly report",
        isLoading: false,
      });
    }
  },

  loadPlans: async () => {
    try {
      set({ billingLoading: true, billingError: null });
      const plans = await api.billing.plans();
      set({ plans, billingLoading: false });
    } catch (err: any) {
      set({
        billingError: err.message || "Failed to load plans",
        billingLoading: false,
      });
    }
  },

  loadSubscription: async () => {
    try {
      set({ billingLoading: true, billingError: null });
      const subscription = await api.billing.subscription();
      set({ subscription, billingLoading: false });
    } catch (err: any) {
      set({
        billingError: err.message || "Failed to load subscription",
        billingLoading: false,
      });
    }
  },

  loadPayments: async () => {
    try {
      set({ billingLoading: true, billingError: null });
      const payments = await api.billing.payments();
      set({ payments, billingLoading: false });
    } catch (err: any) {
      set({
        billingError: err.message || "Failed to load payments",
        billingLoading: false,
      });
    }
  },

  startCheckout: async (planId: PlanId) => {
    if (planId === "free") return;

    try {
      set({ billingLoading: true, billingError: null });
      const base = typeof window !== "undefined" ? window.location.origin : "https://xboostai.netlify.app";
      const successUrl = `${base}/dashboard/billing?checkout=success`;
      const cancelUrl = `${base}/dashboard/billing?checkout=cancel`;
      const response = await api.billing.checkout(planId, { successUrl, cancelUrl });

      if (!response.checkoutUrl) {
        throw new Error("Checkout URL missing");
      }

      if (response.checkoutId && typeof window !== "undefined") {
        window.localStorage.setItem("xboost_pending_checkout_id", response.checkoutId);
      }

      window.location.href = response.checkoutUrl;
      set({ billingLoading: false });
    } catch (err: any) {
      set({
        billingError: err.message || "Failed to start checkout",
        billingLoading: false,
      });
    }
  },

  syncCheckout: async (checkoutId: string) => {
    try {
      set({ billingLoading: true, billingError: null });
      const result = await api.billing.syncCheckout(checkoutId);
      set({
        subscription: result.billing,
        billingLoading: false,
      });
    } catch (err: any) {
      set({
        billingError: err.message || "Failed to sync checkout",
        billingLoading: false,
      });
    }
  },

  openPortal: async () => {
    try {
      set({ billingLoading: true, billingError: null });
      const response = await api.billing.portal();

      if (!response.url) {
        throw new Error("Portal URL missing");
      }

      window.open(response.url, "_blank", "noopener,noreferrer");
      set({ billingLoading: false });
    } catch (err: any) {
      set({
        billingError: err.message || "Failed to open customer portal",
        billingLoading: false,
      });
    }
  },

  cancelSubscription: async () => {
    try {
      set({ billingLoading: true, billingError: null });
      await api.billing.cancel();
      const subscription = await api.billing.subscription();
      set({ subscription, billingLoading: false });
    } catch (err: any) {
      set({
        billingError: err.message || "Failed to cancel subscription",
        billingLoading: false,
      });
    }
  },
}));
